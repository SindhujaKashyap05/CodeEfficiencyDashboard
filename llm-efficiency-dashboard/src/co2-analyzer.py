# co2Analyser.py

"""
CO2 & Energy Consumption Analysis Script for ML Models.

This script performs a static and dynamic analysis of a given PyTorch model
to estimate its energy consumption and carbon footprint for a single inference.

It takes a model file, target hardware, and AWS region as input, and produces
a JSON file with detailed metrics and optimization suggestions.

Example Usage (in a SageMaker environment):
python co2Analyser.py \
    --model-path /opt/ml/processing/input/model/model.pth \
    --output-path /opt/ml/processing/output/ \
    --hardware-type gpu_t4 \
    --region us-east-1

Example Usage (local):
python co2Analyser.py \
    --model-path ./my_model.pth \
    --output-path ./results/ \
    --hardware-type cpu_c5 \
    --region eu-west-1
"""

import os
import json
import time
import argparse
import numpy as np
import torch
import torchvision.models as models

# --- Data for Estimation ---
# Source: Public cloud documentation, academic papers, and carbon intensity maps.
# These are representative values and should be updated for higher accuracy.

# Thermal Design Power (TDP) in Watts for various hardware types.
# This is a proxy for power consumption under load.
HARDWARE_TDP = {
    'cpu_c5': 150,      # Estimated for a typical Intel Xeon Platinum 8000 series
    'gpu_t4': 75,       # NVIDIA Tesla T4
    'gpu_a10g': 150,    # NVIDIA A10G
    'gpu_v100': 300,    # NVIDIA Tesla V100
    'inferentia1': 100, # AWS Inferentia 1
    'graviton2': 120    # Estimated for a full AWS Graviton2 processor
}

# Power Usage Effectiveness (PUE) for AWS Regions.
# PUE = (Total Facility Energy) / (IT Equipment Energy). A lower value is better.
# Source: AWS Sustainability reports (values are illustrative).
REGION_PUE = {
    'us-east-1': 1.15,
    'us-west-2': 1.10, # Oregon has access to hydropower
    'eu-west-1': 1.12, # Ireland
    'eu-central-1': 1.20, # Frankfurt
    'ap-south-1': 1.25, # Mumbai
    'default': 1.20    # A generic default
}

# Carbon Intensity (grams of CO2e per kWh) for AWS Regions.
# Source: Public data from sources like electricityMap or Ember (values are illustrative).
CARBON_INTENSITY_G_PER_KWH = {
    'us-east-1': 379,  # Virginia
    'us-west-2': 89,   # Oregon (largely hydro)
    'eu-west-1': 290,  # Ireland
    'eu-central-1': 339, # Germany
    'ap-south-1': 708, # India
    'default': 400     # A global average
}

# --- Analysis Functions ---

def load_model(model_path):
    """Loads a PyTorch model from a file."""
    print(f"Attempting to load model from: {model_path}")
    try:
        # Check if we are on a GPU machine
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {device}")
        
        # For this example, we assume the model is a state_dict for a known architecture
        # In a real-world scenario, you would need to instantiate the model class first
        # model = YourModelClass()
        # model.load_state_dict(torch.load(model_path))
        
        # As a robust example, let's load a pre-trained ResNet18 if path is invalid/not found
        # This makes the script runnable for demonstration purposes.
        if not os.path.exists(model_path):
            print(f"Warning: Model path not found. Loading a pre-trained ResNet18 for demonstration.")
            model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        else:
            # Here you would implement logic to load your specific model
            # For now, we'll just use ResNet18 as a placeholder for any loaded model
            print("Model path found. Assuming ResNet18 architecture for this example.")
            model = models.resnet18()
            # model.load_state_dict(torch.load(model_path, map_location=device))

        model.to(device)
        model.eval()
        return model, device
    except Exception as e:
        print(f"Error loading model: {e}")
        return None, None

def perform_static_analysis(model):
    """Performs static analysis on the model."""
    if not model:
        return {}
    
    num_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    
    # Check model precision
    precisions = {str(p.dtype) for p in model.parameters()}
    
    # Placeholder for FLOPs calculation (more complex, often requires a library like thop)
    # from thop import profile
    # dummy_input = torch.randn(1, 3, 224, 224).to(next(model.parameters()).device)
    # flops, _ = profile(model, inputs=(dummy_input,), verbose=False)
    
    return {
        "total_parameters": num_params,
        "model_precisions": list(precisions),
        "estimated_flops": 1.8e9 # Hardcoded for ResNet18, replace with real calculation
    }

def perform_dynamic_analysis(model, device, num_runs=50):
    """Runs sample inference to measure latency."""
    if not model:
        return {}
        
    # Create a dummy input tensor typical for image models
    dummy_input = torch.randn(1, 3, 224, 224).to(device)
    
    # Warm-up runs
    for _ in range(10):
        with torch.no_grad():
            _ = model(dummy_input)

    # Timed runs
    latencies = []
    for _ in range(num_runs):
        start_time = time.time()
        with torch.no_grad():
            _ = model(dummy_input)
        
        # For GPU, synchronize to ensure accurate timing
        if device.type == 'cuda':
            torch.cuda.synchronize()
            
        end_time = time.time()
        latencies.append((end_time - start_time) * 1000) # convert to ms
    
    avg_latency_ms = np.mean(latencies)
    
    return {
        "inference_latency_ms": avg_latency_ms
    }

def calculate_co2_metrics(dynamic_metrics, hardware, region):
    """Calculates CO2 and energy metrics based on analysis."""
    latency_ms = dynamic_metrics.get("inference_latency_ms", 0)
    if latency_ms == 0:
        return {}

    # Get estimation factors
    tdp_watts = HARDWARE_TDP.get(hardware, HARDWARE_TDP['cpu_c5'])
    pue = REGION_PUE.get(region, REGION_PUE['default'])
    carbon_intensity = CARBON_INTENSITY_G_PER_KWH.get(region, CARBON_INTENSITY_G_PER_KWH['default'])
    
    # Assume a utilization factor. A GPU/CPU isn't at 100% TDP constantly during inference.
    # This is a key assumption for estimation accuracy.
    utilization_factor = 0.6 

    # Calculations
    power_draw_watts = tdp_watts * utilization_factor
    inference_time_hours = (latency_ms / 1000) / 3600

    energy_consumption_kwh = (power_draw_watts * inference_time_hours) / 1000
    
    # Total CO2e = Energy * Carbon Intensity * Data Center Overhead (PUE)
    co2_emissions_grams = energy_consumption_kwh * carbon_intensity * pue

    return {
        "compute_power_watts": power_draw_watts,
        "energy_consumption_kwh_per_inference": energy_consumption_kwh,
        "co2_emissions_grams_per_inference": co2_emissions_grams,
        "region_carbon_intensity_g_kwh": carbon_intensity,
        "pue_factor": pue
    }

def generate_optimizer_suggestions(static_metrics, hardware):
    """Generates optimization suggestions based on a rules engine."""
    suggestions = []
    
    # Suggestion 1: Quantization
    if 'torch.float32' in static_metrics.get("model_precisions", []):
        suggestions.append({
            "suggestion_code": "QUANT-01",
            "title": "Apply Post-Training Quantization",
            "description": "The model uses 32-bit floating point precision. Quantizing to 16-bit (FP16/BFP16) or 8-bit integers (INT8) can reduce model size by 50-75%, lower latency, and decrease energy use, often with minimal impact on accuracy.",
            "estimated_impact": "High"
        })

    # Suggestion 2: Pruning
    if static_metrics.get("total_parameters", 0) > 10_000_000: # 10 Million params
        suggestions.append({
            "suggestion_code": "PRUNE-01",
            "title": "Explore Model Pruning",
            "description": "With over 10 million parameters, this model may contain redundant weights. Unstructured or structured pruning can create a smaller, faster model by removing unnecessary parameters.",
            "estimated_impact": "Medium"
        })

    # Suggestion 3: Hardware Selection
    is_gpu = 'gpu' in hardware
    if is_gpu and static_metrics.get("total_parameters", 0) < 5_000_000:
         suggestions.append({
            "suggestion_code": "HW-01",
            "title": "Consider More Efficient Hardware",
            "description": "This model is relatively small. A powerful GPU may be underutilized. Consider deploying on a more energy-efficient GPU (e.g., T4), a CPU-based instance (e.g., powered by Graviton), or AWS Inferentia for better cost and energy performance.",
            "estimated_impact": "Medium"
        })
    elif not is_gpu and static_metrics.get("total_parameters", 0) > 20_000_000:
        suggestions.append({
            "suggestion_code": "HW-02",
            "title": "Consider GPU Acceleration",
            "description": "This is a large model. Deploying on a CPU may result in high latency. A GPU-based instance would likely provide significantly better performance and throughput.",
            "estimated_impact": "High"
        })

    return suggestions

def save_results(results, output_path):
    """Saves the final results dictionary to a JSON file."""
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    
    file_path = os.path.join(output_path, "analysis_results.json")
    print(f"Saving results to: {file_path}")
    with open(file_path, 'w') as f:
        json.dump(results, f, indent=4)

# --- Main Execution Block ---

def main(args):
    """Main function to orchestrate the analysis."""
    print("--- Starting CO2 Analysis ---")
    
    # 1. Load Model
    model, device = load_model(args.model_path)
    if not model:
        print("Could not load model. Exiting.")
        return

    # 2. Perform Static Analysis
    print("Performing static analysis...")
    static_metrics = perform_static_analysis(model)
    print(f"Static Analysis Results: {static_metrics}")

    # 3. Perform Dynamic Analysis
    print("Performing dynamic analysis (measuring inference latency)...")
    dynamic_metrics = perform_dynamic_analysis(model, device)
    print(f"Dynamic Analysis Results: {dynamic_metrics}")

    # 4. Calculate CO2 Metrics
    print("Calculating CO2 and energy metrics...")
    co2_metrics = calculate_co2_metrics(dynamic_metrics, args.hardware_type, args.region)
    print(f"CO2 Metrics: {co2_metrics}")

    # 5. Generate Optimizer Suggestions
    print("Generating optimizer suggestions...")
    optimizer_suggestions = generate_optimizer_suggestions(static_metrics, args.hardware_type)
    print(f"Suggestions: {optimizer_suggestions}")
    
    # 6. Combine and Save Results
    final_results = {
        "inputs": {
            "model_path": args.model_path,
            "hardware_type": args.hardware_type,
            "aws_region": args.region
        },
        "static_analysis": static_metrics,
        "dynamic_analysis": dynamic_metrics,
        "co2_estimation": co2_metrics,
        "optimizer_suggestions": optimizer_suggestions
    }
    
    save_results(final_results, args.output_path)
    print("--- Analysis Complete ---")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CO2 & Energy Analysis Script for ML Models")
    
    parser.add_argument('--model-path', type=str, required=True, help='Path to the model file (.pth)')
    parser.add_argument('--output-path', type=str, required=True, help='Path to save the output JSON results')
    parser.add_argument('--hardware-type', type=str, default='cpu_c5', choices=HARDWARE_TDP.keys(), help='Target hardware for analysis')
    parser.add_argument('--region', type=str, default='us-east-1', choices=REGION_PUE.keys(), help='Target AWS region for analysis')

    args = parser.parse_args()
    main(args)
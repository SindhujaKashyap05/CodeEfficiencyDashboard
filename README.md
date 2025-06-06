# CO2 Model Analyzer 🌱

A comprehensive cloud-based system for analyzing the carbon footprint of machine learning models. Upload your trained models and get detailed CO2 emission analytics through an intuitive dashboard.

## 🎯 Overview

The CO2 Model Analyzer automatically calculates the environmental impact of ML models by analyzing their architecture, parameters, and computational requirements. No manual parameter input required - just upload your model and get instant carbon footprint insights.

## ✨ Features

- **Automatic Model Analysis**: Supports PyTorch, TensorFlow, ONNX, and other popular formats
- **Zero-Configuration**: Extract model parameters and architecture automatically
- **Comprehensive Metrics**: Calculate training and inference carbon emissions
- **Real-time Dashboard**: Live updates with interactive visualizations
- **Cloud-Scalable**: Built on AWS with SageMaker Processing for heavy computations
- **Multi-Model Support**: Batch analysis and comparison capabilities

## 🏗️ Architecture

```
User Upload → Java Backend → S3 Storage → SageMaker Processing → DynamoDB → Dashboard
```

### Components:
- **Java Backend**: RESTful API for model uploads and job management
- **Amazon S3**: Secure model file storage
- **SageMaker Processing**: Scalable CO2 analysis execution
- **DynamoDB**: Fast metrics storage and retrieval
- **React Dashboard**: Real-time visualization interface

## 🚀 Quick Start

### Prerequisites
- AWS Account with appropriate permissions
- Java 11+ and Maven
- Node.js 16+ for dashboard
- Docker (for local development)

### Installation

 **Launch Dashboard**
   ```bash
   cd dashboard
   npm install
   npm start
   ```

**Made with 🌱 for a sustainable AI future**

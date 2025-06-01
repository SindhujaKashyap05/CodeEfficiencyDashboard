import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Upload, Activity, Zap, Cpu, TrendingDown, FileText, Settings, Search, Filter, Download } from 'lucide-react';
import './App.css'; // Assuming you have a CSS file for styles
const CO2Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedOptimizationModel, setSelectedOptimizationModel] = useState(null);
  const [models, setModels] = useState([
    { id: 1, name: 'BERT-Base', type: 'NLP', co2: 45.2, status: 'analyzed', lastRun: '2024-12-01' },
    { id: 2, name: 'GPT-3.5', type: 'Language', co2: 234.7, status: 'analyzing', lastRun: '2024-12-02' },
    { id: 3, name: 'ResNet-50', type: 'Vision', co2: 78.3, status: 'analyzed', lastRun: '2024-11-29' },
    { id: 4, name: 'YOLO-v8', type: 'Detection', co2: 156.9, status: 'optimized', lastRun: '2024-12-01' }
  ]);

  // Initialize selectedOptimizationModel with first model
  useEffect(() => {
    if (models.length > 0 && !selectedOptimizationModel) {
      setSelectedOptimizationModel(models[0]);
    }
  }, [models, selectedOptimizationModel]);

  // Model-specific optimizations based on model type
  const getModelOptimizations = (model) => {
    if (!model) return [];
    
    const baseOptimizations = {
      'NLP': [
        { technique: 'Model Pruning', reduction: '25%', impact: 'High', difficulty: 'Medium', description: 'Remove redundant attention heads and layers' },
        { technique: 'Quantization', reduction: '35%', impact: 'High', difficulty: 'Low', description: 'Convert to INT8 precision for faster inference' },
        { technique: 'Knowledge Distillation', reduction: '45%', impact: 'Medium', difficulty: 'High', description: 'Create smaller student model from BERT' },
        { technique: 'Layer Freezing', reduction: '20%', impact: 'Low', difficulty: 'Low', description: 'Freeze early transformer layers' }
      ],
      'Language': [
        { technique: 'Model Pruning', reduction: '30%', impact: 'High', difficulty: 'High', description: 'Structured pruning of transformer blocks' },
        { technique: 'Quantization', reduction: '40%', impact: 'High', difficulty: 'Medium', description: 'Mixed precision optimization' },
        { technique: 'Knowledge Distillation', reduction: '50%', impact: 'Medium', difficulty: 'High', description: 'Distill to smaller architecture' },
        { technique: 'Gradient Checkpointing', reduction: '15%', impact: 'Low', difficulty: 'Low', description: 'Reduce memory usage during training' }
      ],
      'Vision': [
        { technique: 'Channel Pruning', reduction: '35%', impact: 'High', difficulty: 'Medium', description: 'Remove less important CNN channels' },
        { technique: 'Quantization', reduction: '40%', impact: 'High', difficulty: 'Low', description: 'Post-training quantization' },
        { technique: 'MobileNet Architecture', reduction: '60%', impact: 'Medium', difficulty: 'High', description: 'Replace with efficient architecture' },
        { technique: 'Input Resolution Reduction', reduction: '25%', impact: 'Low', difficulty: 'Low', description: 'Optimize input image size' }
      ],
      'Detection': [
        { technique: 'Model Pruning', reduction: '28%', impact: 'High', difficulty: 'Medium', description: 'Prune detection head layers' },
        { technique: 'Quantization', reduction: '32%', impact: 'High', difficulty: 'Low', description: 'Quantize backbone and neck' },
        { technique: 'NAS Optimization', reduction: '45%', impact: 'High', difficulty: 'High', description: 'Neural architecture search' },
        { technique: 'Anchor Optimization', reduction: '18%', impact: 'Low', difficulty: 'Low', description: 'Reduce number of anchor boxes' }
      ]
    };
    return baseOptimizations[model.type] || baseOptimizations['NLP'];
  };

  const emissionData = [
    { name: 'Jan', training: 120, inference: 80, total: 200 },
    { name: 'Feb', training: 140, inference: 75, total: 215 },
    { name: 'Mar', training: 110, inference: 85, total: 195 },
    { name: 'Apr', training: 95, inference: 70, total: 165 },
    { name: 'May', training: 130, inference: 90, total: 220 },
    { name: 'Jun', training: 85, inference: 65, total: 150 }
  ];

  const modelComparison = [
    { name: 'Original', co2: 234.7, accuracy: 92.1, energy: 450 },
    { name: 'Pruned', co2: 187.3, accuracy: 91.8, energy: 360 },
    { name: 'Quantized', co2: 156.2, accuracy: 91.5, energy: 298 },
    { name: 'Distilled', co2: 134.8, accuracy: 90.9, energy: 267 }
  ];

  const pieData = [
    { name: 'Training', value: 65, color: '#8884d8' },
    { name: 'Inference', value: 25, color: '#82ca9d' },
    { name: 'Infrastructure', value: 10, color: '#ffc658' }
  ];

  const optimizations = [
    { technique: 'Model Pruning', reduction: '25%', impact: 'High', difficulty: 'Medium' },
    { technique: 'Quantization', reduction: '35%', impact: 'High', difficulty: 'Low' },
    { technique: 'Knowledge Distillation', reduction: '45%', impact: 'Medium', difficulty: 'High' },
    { technique: 'Hardware Optimization', reduction: '15%', impact: 'Low', difficulty: 'Low' }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total CO2 Saved</p>
              <p className="text-2xl font-bold text-green-600">142.3 kg</p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Models Analyzed</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Reduction</p>
              <p className="text-2xl font-bold text-purple-600">28%</p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Energy Saved</p>
              <p className="text-2xl font-bold text-orange-600">1.2 MWh</p>
            </div>
            <Cpu className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* CO2 Trends Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">CO2 Emission Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={emissionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="training" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="inference" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="total" stroke="#ff7c7c" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Emission Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Emission Sources</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Model Management</h3>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Model
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Drag and drop your model files or click to browse</p>
          <p className="text-sm text-gray-400 mt-2">Supports .pkl, .pt, .h5, .onnx formats</p>
        </div>
      </div>

      {/* Models List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Models</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search models..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {models.map((model) => (
            <div key={model.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    {model.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{model.name}</h4>
                    <p className="text-gray-600">{model.type} Model</p>
                    <p className="text-sm text-gray-400">Last analyzed: {model.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{model.co2} kg</p>
                    <p className="text-sm text-gray-600">CO2 Emission</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    model.status === 'analyzed' ? 'bg-green-100 text-green-800' :
                    model.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {model.status}
                  </div>
                  <button 
                    onClick={() => setSelectedModel(model)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOptimizations = () => {
    if (!selectedOptimizationModel) return <div>Loading...</div>;
    
    const currentOptimizations = getModelOptimizations(selectedOptimizationModel);

    return (
      <div className="space-y-6">
        {/* Model Selection */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Select Model for Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                onClick={() => setSelectedOptimizationModel(model)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOptimizationModel.id === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    {model.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{model.name}</h4>
                    <p className="text-sm text-gray-600">{model.type}</p>
                    <p className="text-sm font-medium text-red-600">{model.co2} kg CO2</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Model Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                {selectedOptimizationModel.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedOptimizationModel.name} Optimization</h3>
                <p className="text-gray-600">{selectedOptimizationModel.type} Model • Current CO2: {selectedOptimizationModel.co2} kg</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Potential Savings</p>
              <p className="text-2xl font-bold text-green-600">Up to 50% CO2</p>
            </div>
          </div>
        </div>

        {/* Model-Specific Optimization Recommendations */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Optimization Recommendations for {selectedOptimizationModel.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentOptimizations.map((opt, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{opt.technique}</h4>
                  <span className="text-2xl font-bold text-green-600">{opt.reduction}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{opt.description}</p>
                <div className="flex justify-between text-sm mb-3">
                  <span className={`px-2 py-1 rounded-full ${
                    opt.impact === 'High' ? 'bg-red-100 text-red-800' :
                    opt.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {opt.impact} Impact
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    opt.difficulty === 'High' ? 'bg-red-100 text-red-800' :
                    opt.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {opt.difficulty} Difficulty
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Estimated CO2 Reduction:</span>
                    <span className="font-medium">{(parseFloat(selectedOptimizationModel.co2) * parseFloat(opt.reduction) / 100).toFixed(1)} kg</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert(`Applying ${opt.technique} to ${selectedOptimizationModel.name}...\nEstimated time: 15-30 minutes`);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply to {selectedOptimizationModel.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model-Specific Before/After Comparison */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">{selectedOptimizationModel.name} - Optimization Results</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Current vs Optimized Metrics</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Original', co2: selectedOptimizationModel.co2, accuracy: 92.1, energy: selectedOptimizationModel.co2 * 2.1 },
                  { name: 'Optimized', co2: selectedOptimizationModel.co2 * 0.65, accuracy: 91.2, energy: selectedOptimizationModel.co2 * 1.4 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="co2" fill="#ff7c7c" name="CO2 Emission (kg)" />
                  <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="font-medium mb-3">Optimization Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-green-800">Quantization Applied</p>
                    <p className="text-sm text-green-600">35% CO2 reduction achieved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-blue-800">Model Pruning</p>
                    <p className="text-sm text-blue-600">In progress - 2 hours remaining</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-600">Knowledge Distillation</p>
                    <p className="text-sm text-gray-500">Pending - starts after pruning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Energy Consumption by Phase</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="training" stackId="a" fill="#8884d8" />
              <Bar dataKey="inference" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Historical Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="co2" stroke="#ff7c7c" strokeWidth={3} />
              <Line type="monotone" dataKey="energy" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Detailed Metrics</h3>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO2 (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energy (kWh)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPU Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{model.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">{model.co2}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{(model.co2 * 2.1).toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{(model.co2 * 0.8).toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      model.co2 < 100 ? 'bg-green-100 text-green-800' :
                      model.co2 < 200 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {model.co2 < 100 ? 'Excellent' : model.co2 < 200 ? 'Good' : 'Needs Optimization'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900">EcoAI Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'models', label: 'Models', icon: Cpu },
              { id: 'optimizations', label: 'Optimizations', icon: Zap },
              { id: 'analytics', label: 'Analytics', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'models' && renderModels()}
        {activeTab === 'optimizations' && renderOptimizations()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default CO2Dashboard;
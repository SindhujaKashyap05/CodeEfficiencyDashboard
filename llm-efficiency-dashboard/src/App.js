import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Cpu, TrendingDown, FileText, Settings, Download } from 'lucide-react';
import './App.css';
import 'tailwindcss/tailwind.css';

const CO2Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedOptimizationModelId, setExpandedOptimizationModelId] = useState(null);
  const [backendMetrics, setBackendMetrics] = useState(null);

  // Toast state for upload
  const [uploading, setUploading] = useState(false);
  const [uploadToast, setUploadToast] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/vi/fetch')
      .then(res => res.json())
      .then(data => {
        setBackendMetrics(Array.isArray(data) ? data[0] : data);
      })
      .catch(err => {
        console.error('Failed to fetch backend metrics:', err);
      });
  }, []);

  // Generate all data from backendMetrics
  const emissionData = backendMetrics
    ? [
        { name: 'Jan', training: backendMetrics.staticEmission, inference: backendMetrics.dynamicEmission, total: backendMetrics.staticEmission + backendMetrics.dynamicEmission },
        { name: 'Feb', training: backendMetrics.staticEmission, inference: backendMetrics.dynamicEmission, total: backendMetrics.staticEmission + backendMetrics.dynamicEmission },
        { name: 'Mar', training: backendMetrics.staticEmission, inference: backendMetrics.dynamicEmission, total: backendMetrics.staticEmission + backendMetrics.dynamicEmission },
        { name: 'Apr', training: backendMetrics.staticEmission, inference: backendMetrics.dynamicEmission, total: backendMetrics.staticEmission + backendMetrics.dynamicEmission },
        { name: 'May', training: backendMetrics.staticEmission, inference: backendMetrics.dynamicEmission, total: backendMetrics.staticEmission + backendMetrics.dynamicEmission },
        { name: 'Jun', training: backendMetrics.staticEmission, inference: backendMetrics.dynamicEmission, total: backendMetrics.staticEmission + backendMetrics.dynamicEmission }
      ]
    : [];

  const pieData = backendMetrics
    ? [
        { name: 'Training', value: backendMetrics.staticEmission, color: '#8884d8' },
        { name: 'Inference', value: backendMetrics.dynamicEmission, color: '#82ca9d' },
        { name: 'Infrastructure', value: 0.01, color: '#ffc658' }
      ]
    : [];

  const modelComparison = backendMetrics
    ? [
        { name: 'Original', co2: backendMetrics.staticEmission + backendMetrics.dynamicEmission, accuracy: 92.1, energy: backendMetrics.dynamicPower * 1000 },
        { name: 'Pruned', co2: (backendMetrics.staticEmission + backendMetrics.dynamicEmission) * 0.8, accuracy: 91.8, energy: backendMetrics.dynamicPower * 800 },
        { name: 'Quantized', co2: (backendMetrics.staticEmission + backendMetrics.dynamicEmission) * 0.7, accuracy: 91.5, energy: backendMetrics.dynamicPower * 700 },
        { name: 'Distilled', co2: (backendMetrics.staticEmission + backendMetrics.dynamicEmission) * 0.6, accuracy: 90.9, energy: backendMetrics.dynamicPower * 600 }
      ]
    : [];

  const models = backendMetrics
    ? [
        {
          id: 1,
          name: backendMetrics.jobName,
          type: 'NLP',
          co2: (backendMetrics.staticEmission + backendMetrics.dynamicEmission),
          status: backendMetrics.jobStatus,
          lastRun: backendMetrics.creationTime
        }
      ]
    : [];

  const [uploadData, setUploadData] = useState({
    modelName: '',
    version: '',
    file: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setUploadData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadToast('Uploading...');
    const formData = new FormData();
    formData.append('file', uploadData.file);

    const params = new URLSearchParams({
      modelName: uploadData.modelName,
      version: uploadData.version
    });

    try {
      const response = await fetch(`http://localhost:8080/api/v1/models/upload?${params.toString()}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setUploadToast('Model uploaded successfully');
      } else {
        setUploadToast(`Upload failed: ${data.message || data.error}`);
      }
    } catch (err) {
      setUploadToast('Error uploading model: ' + err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadToast(''), 3000);
    }
  };

  const getModelOptimizations = (model) => {
    if (!model) return [];
    return [
      { technique: 'Model Pruning', reduction: '25', impact: 'High', difficulty: 'Medium', description: 'Remove redundant layers' },
      { technique: 'Quantization', reduction: '35', impact: 'High', difficulty: 'Low', description: 'Convert to INT8 precision' },
      { technique: 'Knowledge Distillation', reduction: '45', impact: 'Medium', difficulty: 'High', description: 'Create smaller student model' }
    ];
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total CO2 Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {backendMetrics
                  ? `${(backendMetrics.staticEmission + backendMetrics.dynamicEmission).toFixed(4)} kg`
                  : '...'}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dynamic Power</p>
              <p className="text-2xl font-bold text-blue-600">
                {backendMetrics
                  ? `${backendMetrics.dynamicPower} kWh`
                  : '...'}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Job Status</p>
              <p className="text-2xl font-bold text-purple-600">
                {backendMetrics
                  ? backendMetrics.jobStatus
                  : '...'}
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="text-2xl font-bold text-orange-600">
                {backendMetrics
                  ? backendMetrics.creationTime
                  : '...'}
              </p>
            </div>
            <Cpu className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-6">
      <h3 className="text-lg font-semibold mb-4">Upload a New Model</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Model Name"
          name="modelName"
          value={uploadData.modelName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Version"
          name="version"
          value={uploadData.version}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500">
          <input
            type="file"
            accept=".pkl,.pt,.h5,.onnx,.joblib, .pb, .pth, .pmml,.json,.ipynb"
            onChange={handleFileChange}
            className="hidden"
            id="modelFile"
          />
          <label htmlFor="modelFile" className="cursor-pointer">
            {uploadData.file ? uploadData.file.name : 'Click to select a model file'}
          </label>
        </div>
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          disabled={!uploadData.file || !uploadData.modelName || !uploadData.version || uploading}
        >
          Upload Model
        </button>
      </div>
    </div>
  );

  const renderOptimizations = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Select Model for Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => {
            const isExpanded = expandedOptimizationModelId === model.id;
            const currentOptimizations = getModelOptimizations(model);
            return (
              <React.Fragment key={model.id}>
                <div
                  onClick={() =>
                    setExpandedOptimizationModelId(isExpanded ? null : model.id)
                  }
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isExpanded
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
                {isExpanded && (
                  <div className="col-span-full mt-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                            {model.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{model.name} Optimization</h3>
                            <p className="text-gray-600">{model.type} Model • Current CO2: {model.co2} kg</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Potential Savings</p>
                          <p className="text-2xl font-bold text-green-600">Up to 50% CO2</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
                      <h3 className="text-lg font-semibold mb-4">Optimization Recommendations for {model.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentOptimizations.map((opt, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">{opt.technique}</h4>
                              <span className="text-2xl font-bold text-green-600">{opt.reduction}%</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{opt.description}</p>
                            <div className="flex justify-between text-sm mb-3">
                              <span className={`px-2 py-1 rounded-full ${opt.impact === 'High' ? 'bg-red-100 text-red-800' :
                                opt.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                {opt.impact} Impact
                              </span>
                              <span className={`px-2 py-1 rounded-full ${opt.difficulty === 'High' ? 'bg-red-100 text-red-800' :
                                opt.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                {opt.difficulty} Difficulty
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs text-gray-500 flex justify-between">
                                <span>Estimated CO2 Reduction:</span>
                                <span className="font-medium">{(parseFloat(model.co2) * parseFloat(opt.reduction) / 100).toFixed(1)} kg</span>
                              </div>
                              <button
                                onClick={() => {
                                  alert(`Applying ${opt.technique} to ${model.name}...\nEstimated time: 15-30 minutes`);
                                }}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Apply to {model.name}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold mb-4">{model.name} - Optimization Results</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Current vs Optimized Metrics</h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                              { name: 'Original', co2: model.co2, accuracy: 92.1, energy: model.co2 * 2.1 },
                              { name: 'Optimized', co2: model.co2 * 0.65, accuracy: 91.2, energy: model.co2 * 1.4 }
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
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${model.co2 < 100 ? 'bg-green-100 text-green-800' :
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
      {/* Toast notification */}
      {uploadToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all
            ${uploading ? 'bg-blue-600' : uploadToast.includes('successfully') ? 'bg-green-600' : 'bg-red-600'}`}>
            {uploadToast}
          </div>
        </div>
      )}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900">Carbon Scope Dashboard</h1>
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
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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
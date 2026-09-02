'use client';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

import { useState } from 'react';
import axios from 'axios';

interface HouseFeatures {
  crim: number;
  zn: number;
  indus: number;
  chas: number;
  nox: number;
  rm: number;
  age: number;
  dis: number;
  rad: number;
  tax: number;
  ptratio: number;
  b: number;
  lstat: number;
  // medv: number;
}

export default function Home() {
  const [formData, setFormData] = useState<HouseFeatures>({
    crim: 0.00632,
    zn: 18.0,
    indus: 2.31,
    chas: 0,
    nox: 0.538,
    rm: 6.575,
    age: 65.2,
    dis: 4.0900,
    rad: 1,
    tax: 296,
    ptratio: 15.3,
    b: 396.90,
    lstat: 4.98,
    // medv: 24.0,
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Update the handleSubmit function:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setPrediction(null);

  try {
    const response = await axios.post(`${API_URL}/predict`, formData);
    setPrediction(response.data.formatted_price);
  } catch (err: any) {
    setError(err.response?.data?.detail || 'An error occurred during prediction');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏡 Heights Real Estate Price Predictor
          </h1>
          <p className="text-lg text-gray-600">
            Enter property details to get an estimated price
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location & Environment */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📍</span> Location & Environment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crime Rate (CRIM)
                  </label>
                  <input
                    type="number"
                    name="crim"
                    value={formData.crim}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.00001"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Per capita crime rate</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residential Zone (ZN)
                  </label>
                  <input
                    type="number"
                    name="zn"
                    value={formData.zn}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">% of land zoned for large lots</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industrial (INDUS)
                  </label>
                  <input
                    type="number"
                    name="indus"
                    value={formData.indus}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">% non-retail business acres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charles River (CHAS)
                  </label>
                  <select
                    name="chas"
                    value={formData.chas}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="0">Not on River</option>
                    <option value="1">On River</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Bounds Charles River</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NOx Concentration (NOX)
                  </label>
                  <input
                    type="number"
                    name="nox"
                    value={formData.nox}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.001"
                    min="0"
                    max="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Nitric oxides (parts per 10M)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance to Centers (DIS)
                  </label>
                  <input
                    type="number"
                    name="dis"
                    value={formData.dis}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.0001"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Weighted distance to employment</p>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏠</span> Property Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avg Rooms (RM)
                  </label>
                  <input
                    type="number"
                    name="rm"
                    value={formData.rm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.001"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Average number of rooms</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Age (AGE)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">% built before 1940</p>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Median Value (MEDV)
                  </label>
                  <input
                    type="number"
                    name="medv"
                    value={formData.medv}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Median value ($1000s)</p>
                </div> */}
              </div>
            </div>

            {/* Infrastructure & Services */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🚗</span> Infrastructure & Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highway Access (RAD)
                  </label>
                  <input
                    type="number"
                    name="rad"
                    value={formData.rad}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    max="24"
                  />
                  <p className="text-xs text-gray-500 mt-1">Index of accessibility (1-24)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Tax (TAX)
                  </label>
                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Rate per $10,000</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pupil-Teacher Ratio (PTRATIO)
                  </label>
                  <input
                    type="number"
                    name="ptratio"
                    value={formData.ptratio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Students per teacher</p>
                </div>
              </div>
            </div>

            {/* Demographics */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">👥</span> Demographics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Black Population (B)
                  </label>
                  <input
                    type="number"
                    name="b"
                    value={formData.b}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                    max="400"
                  />
                  <p className="text-xs text-gray-500 mt-1">1000(Bk - 0.63)²</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lower Status % (LSTAT)
                  </label>
                  <input
                    type="number"
                    name="lstat"
                    value={formData.lstat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">% lower status population</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Predicting...
                  </span>
                ) : (
                  '🔮 Predict House Price'
                )}
              </button>
            </div>
          </form>

          {/* Results */}
          {prediction && (
            <div className="mt-8 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    💰 Predicted House Price
                  </h3>
                  <p className="text-5xl font-bold text-green-600">
                    {prediction}
                  </p>
                </div>
                <div className="text-6xl">
                  🏠
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-start">
                <div className="text-2xl mr-3">⚠️</div>
                <div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">
                    Error
                  </h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ About This Dataset</h3>
          <p className="text-blue-800 text-sm">
            This predictor uses the Boston Housing dataset with 14 features including crime rate, 
            number of rooms, property age, accessibility, and neighborhood demographics to estimate house prices.
          </p>
        </div>
      </div>
    </div>
  );
}
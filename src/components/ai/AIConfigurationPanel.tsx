import React, { useState } from 'react';
import { Brain, Settings, MessageSquare, Zap, Save, TestTube, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useApp } from '../../contexts/AppContext';

const toneOptions = [
  { value: 'formal', label: 'Formel et professionnel' },
  { value: 'friendly', label: 'Amical et chaleureux' },
  { value: 'neutral', label: 'Neutre et factuel' }
];

const responseTimeOptions = [
  { value: 'instant', label: 'Instantané (< 30 sec)' },
  { value: 'fast', label: 'Rapide (< 2 min)' },
  { value: 'normal', label: 'Normal (< 5 min)' }
];

const confidenceThresholds = [
  { value: '0.7', label: '70% - Conservateur' },
  { value: '0.8', label: '80% - Équilibré' },
  { value: '0.9', label: '90% - Agressif' }
];

export function AIConfigurationPanel() {
  const { businessInfo, setBusinessInfo } = useApp();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  const [aiConfig, setAiConfig] = useState({
    tone: businessInfo?.tonePreference || 'friendly',
    responseTime: 'fast',
    confidenceThreshold: '0.8',
    autoEscalation: true,
    learningMode: true,
    customPrompts: {
      greeting: 'Bonjour {customerName},\n\nMerci pour votre message.',
      closing: 'Cordialement,\nL\'équipe SAV',
      escalation: 'Votre demande nécessite une attention particulière. Un agent va vous contacter sous peu.'
    },
    categories: {
      delivery: { enabled: true, autoResponse: true },
      return: { enabled: true, autoResponse: true },
      complaint: { enabled: true, autoResponse: false },
      order: { enabled: true, autoResponse: true }
    }
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (businessInfo) {
      setBusinessInfo({
        ...businessInfo,
        tonePreference: aiConfig.tone as any
      });
    }
    
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestResult({
      input: 'Bonjour, je n\'ai pas reçu ma commande #12345',
      analysis: {
        category: 'delivery',
        priority: 'medium',
        sentiment: 'neutral',
        confidence: 0.92
      },
      response: 'Bonjour,\n\nMerci pour votre message. Je comprends votre inquiétude concernant votre commande #12345.\n\nJ\'ai vérifié le statut de votre commande et elle est actuellement en transit. Vous devriez la recevoir d\'ici 2-3 jours ouvrés.\n\nCordialement,\nL\'équipe SAV'
    });
    
    setTesting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuration IA Avancée</h2>
        <p className="text-gray-600">Personnalisez le comportement de votre assistant IA</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration générale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              Paramètres généraux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Ton de réponse"
              value={aiConfig.tone}
              onChange={(e) => setAiConfig({...aiConfig, tone: e.target.value})}
              options={toneOptions}
            />

            <Select
              label="Temps de réponse cible"
              value={aiConfig.responseTime}
              onChange={(e) => setAiConfig({...aiConfig, responseTime: e.target.value})}
              options={responseTimeOptions}
            />

            <Select
              label="Seuil de confiance"
              value={aiConfig.confidenceThreshold}
              onChange={(e) => setAiConfig({...aiConfig, confidenceThreshold: e.target.value})}
              options={confidenceThresholds}
            />

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiConfig.autoEscalation}
                  onChange={(e) => setAiConfig({...aiConfig, autoEscalation: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Escalade automatique</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Transférer automatiquement les cas complexes à un agent humain
              </p>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiConfig.learningMode}
                  onChange={(e) => setAiConfig({...aiConfig, learningMode: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Mode apprentissage</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                L'IA apprend de vos corrections pour améliorer ses réponses
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prompts personnalisés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              Prompts personnalisés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formule d'accueil
              </label>
              <textarea
                value={aiConfig.customPrompts.greeting}
                onChange={(e) => setAiConfig({
                  ...aiConfig,
                  customPrompts: {...aiConfig.customPrompts, greeting: e.target.value}
                })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formule de clôture
              </label>
              <textarea
                value={aiConfig.customPrompts.closing}
                onChange={(e) => setAiConfig({
                  ...aiConfig,
                  customPrompts: {...aiConfig.customPrompts, closing: e.target.value}
                })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message d'escalade
              </label>
              <textarea
                value={aiConfig.customPrompts.escalation}
                onChange={(e) => setAiConfig({
                  ...aiConfig,
                  customPrompts: {...aiConfig.customPrompts, escalation: e.target.value}
                })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Configuration par catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(aiConfig.categories).map(([category, config]) => (
              <div key={category} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => setAiConfig({
                        ...aiConfig,
                        categories: {
                          ...aiConfig.categories,
                          [category]: {...config, enabled: e.target.checked}
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Activé</span>
                  </label>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.autoResponse}
                    onChange={(e) => setAiConfig({
                      ...aiConfig,
                      categories: {
                        ...aiConfig.categories,
                        [category]: {...config, autoResponse: e.target.checked}
                      }
                    })}
                    disabled={!config.enabled}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Réponse automatique</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test de l'IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-orange-500" />
            Test de l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message de test
              </label>
              <textarea
                placeholder="Saisissez un message client pour tester la réponse de l'IA..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button
              onClick={handleTest}
              loading={testing}
              className="flex items-center gap-2"
            >
              <TestTube size={16} />
              {testing ? 'Test en cours...' : 'Tester la réponse IA'}
            </Button>

            {testResult && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Analyse IA</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Catégorie:</span>
                      <span className="ml-2 font-medium">{testResult.analysis.category}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Priorité:</span>
                      <span className="ml-2 font-medium">{testResult.analysis.priority}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Sentiment:</span>
                      <span className="ml-2 font-medium">{testResult.analysis.sentiment}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Confiance:</span>
                      <span className="ml-2 font-medium">{Math.round(testResult.analysis.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Réponse générée</h4>
                  <div className="text-sm text-green-800 whitespace-pre-line">
                    {testResult.response}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Performance IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-blue-700">Précision</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-green-700">Automatisation</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4.7/5</div>
              <div className="text-sm text-purple-700">Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">23s</div>
              <div className="text-sm text-orange-700">Temps moyen</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          Réinitialiser
        </Button>
        <Button
          onClick={handleSave}
          loading={saving}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
        </Button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Users, 
  Settings, 
  Trash2, 
  Plus, 
  Save,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lead, WheelSegment } from '@/types/wheel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminPanelProps {
  leads: Lead[];
  segments: WheelSegment[];
  onUpdateSegments: (segments: WheelSegment[]) => void;
  onBack: () => void;
}

const SEGMENT_COLORS = [
  'hsl(142, 71%, 45%)',
  'hsl(45, 93%, 47%)',
  'hsl(221, 83%, 53%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 68%, 60%)',
  'hsl(173, 80%, 40%)',
  'hsl(24, 95%, 53%)',
  'hsl(262, 83%, 58%)',
];

export const AdminPanel = ({ leads, segments, onUpdateSegments, onBack }: AdminPanelProps) => {
  const [editedSegments, setEditedSegments] = useState<WheelSegment[]>(segments);
  const [hasChanges, setHasChanges] = useState(false);

  const downloadCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Name', 'Phone', 'Email', 'Prize Won', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => 
        [
          `"${lead.name}"`,
          `"${lead.phone}"`,
          `"${lead.email}"`,
          `"${lead.prizeWon}"`,
          `"${lead.timestamp}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const updateSegment = (id: string, field: keyof WheelSegment, value: string | number) => {
    setEditedSegments(prev => 
      prev.map(seg => seg.id === id ? { ...seg, [field]: value } : seg)
    );
    setHasChanges(true);
  };

  const addSegment = () => {
    if (editedSegments.length >= 12) return;
    
    const newId = String(Date.now());
    const colorIndex = editedSegments.length % SEGMENT_COLORS.length;
    
    setEditedSegments(prev => [
      ...prev,
      {
        id: newId,
        name: 'New Prize',
        color: SEGMENT_COLORS[colorIndex],
        probability: 10
      }
    ]);
    setHasChanges(true);
  };

  const removeSegment = (id: string) => {
    if (editedSegments.length <= 2) return;
    setEditedSegments(prev => prev.filter(seg => seg.id !== id));
    setHasChanges(true);
  };

  const saveChanges = () => {
    onUpdateSegments(editedSegments);
    setHasChanges(false);
  };

  const totalProbability = editedSegments.reduce((sum, seg) => sum + seg.probability, 0);
  const isProbabilityValid = Math.abs(totalProbability - 100) < 0.1;

  return (
    <div className="min-h-screen bg-gradient-dark p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage leads and configure your wheel
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger 
              value="leads" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6"
            >
              <Users className="w-4 h-4 mr-2" />
              Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger 
              value="config"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6"
            >
              <Settings className="w-4 h-4 mr-2" />
              Wheel Config
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Collected Leads
                </h2>
                <Button
                  onClick={downloadCSV}
                  disabled={leads.length === 0}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No leads collected yet</p>
                  <p className="text-muted-foreground text-sm">
                    Leads will appear here after users spin the wheel
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-dark">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Prize Won</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="font-medium text-foreground">{lead.name}</td>
                          <td className="text-muted-foreground">{lead.phone}</td>
                          <td className="text-muted-foreground">{lead.email}</td>
                          <td>
                            <span className="inline-flex px-2 py-1 rounded-md bg-primary/20 text-primary text-xs font-medium">
                              {lead.prizeWon}
                            </span>
                          </td>
                          <td className="text-muted-foreground text-sm">
                            {new Date(lead.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-4">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Wheel Segments
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Configure prizes and their win probability
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={addSegment}
                    disabled={editedSegments.length >= 12}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Segment
                  </Button>
                  <Button
                    onClick={saveChanges}
                    disabled={!hasChanges || !isProbabilityValid}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Probability warning */}
              {!isProbabilityValid && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">
                    Total probability must equal 100%. Current: {totalProbability.toFixed(1)}%
                  </p>
                </div>
              )}

              {/* Segments list */}
              <div className="space-y-4">
                {editedSegments.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    {/* Color picker */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-10 h-10 rounded-lg border-2 border-border"
                        style={{ backgroundColor: segment.color }}
                      />
                    </div>

                    {/* Prize name */}
                    <div className="flex-1 min-w-0">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Prize Name
                      </Label>
                      <Input
                        value={segment.name}
                        onChange={(e) => updateSegment(segment.id, 'name', e.target.value)}
                        className="input-dark h-9"
                        placeholder="Prize name"
                        maxLength={30}
                      />
                    </div>

                    {/* Color select */}
                    <div className="w-32">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Color
                      </Label>
                      <select
                        value={segment.color}
                        onChange={(e) => updateSegment(segment.id, 'color', e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-input border border-border text-foreground text-sm"
                      >
                        {SEGMENT_COLORS.map((color, i) => (
                          <option key={color} value={color}>
                            Color {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Probability */}
                    <div className="w-28">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Probability %
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={segment.probability}
                        onChange={(e) => updateSegment(segment.id, 'probability', parseFloat(e.target.value) || 0)}
                        className="input-dark h-9"
                      />
                    </div>

                    {/* Delete button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSegment(segment.id)}
                      disabled={editedSegments.length <= 2}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Total probability display */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Probability:</span>
                  <span className={`font-mono font-bold text-lg ${isProbabilityValid ? 'text-green-500' : 'text-destructive'}`}>
                    {totalProbability.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

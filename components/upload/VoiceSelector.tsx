// components/upload/VoiceSelector.tsx
import { FieldSet, FieldLegend, FieldGroup } from "@/components/ui/field";

interface Voice {
  id: string;
  name: string;
  desc: string;
}

const voiceGroups: { male: Voice[]; female: Voice[] } = {
  male: [
    { id: "dave", name: "Dave", desc: "Young male, British Essex, casual & conversational" },
    { id: "daniel", name: "Daniel", desc: "Middle aged male, British, authoritative but warm" },
    { id: "chris", name: "Chris", desc: "Male, casual & easy-going" },
  ],
  female: [
    { id: "rachel", name: "Rachel", desc: "Young female, American, calm & clear" },
    { id: "sarah", name: "Sarah", desc: "Young female, American, soft & approachable" },
  ],
};

interface VoiceSelectorProps {
  currentVoiceId: string;
  onSelect: (id: string) => void;
  error?: string;
}

export function VoiceSelector({ currentVoiceId, onSelect, error }: VoiceSelectorProps) {
  return (
    <FieldSet>
      <FieldLegend className="font-bold text-zinc-900 text-lg mb-4">Choose Assistant Voice</FieldLegend>
      
      <FieldGroup className="space-y-6">
        {/* Male Voices Group */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Male Voices</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {voiceGroups.male.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={currentVoiceId === voice.id}
                onClick={() => onSelect(voice.id)}
              />
            ))}
          </div>
        </div>

        {/* Female Voices Group */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Female Voices</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voiceGroups.female.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={currentVoiceId === voice.id}
                onClick={() => onSelect(voice.id)}
              />
            ))}
          </div>
        </div>
      </FieldGroup>
      {error && <p className="text-sm text-red-500 font-medium mt-2">{error}</p>}
    </FieldSet>
  );
}

// Internal Sub-component for the card
function VoiceCard({ voice, isSelected, onClick }: { voice: Voice; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm ${
        isSelected
          ? "bg-[#FDF6F0] border-[#D7BCA3] ring-1 ring-[#D7BCA3]"
          : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
          isSelected ? "border-[#663820]" : "border-stone-300"
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-[#663820]" />}
        </div>
        <div>
          <h4 className={`font-bold text-sm ${isSelected ? "text-zinc-900" : "text-zinc-700"}`}>
            {voice.name}
          </h4>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">{voice.desc}</p>
        </div>
      </div>
    </div>
  );
}
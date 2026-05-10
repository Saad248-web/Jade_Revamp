
import re

# ─── HELPER ───────────────────────────────────────────────────────────────────
INNER = "max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16"

def section_block(color, section_id, content):
    """Wrap content in a full-width alternating section block."""
    return f'''
            {{/* {section_id.upper()} — {"Green" if color == "#0B2C23" else "Charcoal"} */}}
            <section id="{section_id.lower()}" className="w-full bg-[{color}] text-white">
              <div className="{INNER}">
{content}
              </div>
            </section>'''

# ─── FIX VenueOverlay.tsx ─────────────────────────────────────────────────────
with open('src/components/VenueOverlay.tsx', 'r', encoding='utf-8') as f:
    vo = f.read()

# The current VenueOverlay still has the old wrapper approach from our previous fix.
# Check current state
if 'bg-[#0B2C23]' in vo:
    print("VenueOverlay already has alternating colors - checking structure...")
    # Count occurrences
    green_count = vo.count('bg-[#0B2C23]')
    charcoal_count = vo.count('bg-[#25282C]')
    print(f"  Green sections: {green_count}, Charcoal sections: {charcoal_count}")
else:
    print("VenueOverlay: no alternating colors found")

# ─── FIX PartyVenueOverlay.tsx ────────────────────────────────────────────────
with open('src/components/PartyVenueOverlay.tsx', 'r', encoding='utf-8') as f:
    pvo = f.read()

print("\nPartyVenueOverlay current bg classes:")
for color in ['bg-[#0B2C23]', 'bg-[#25282C]', 'bg-jade-green', 'px-6 py-8', 'space-y-24']:
    count = pvo.count(color)
    if count:
        print(f"  {color!r}: {count}")

print("\nDone checking.")

# 🧠 BodyTrack AI – AI-Powered Physique Analyzer

**BodyTrack AI** is an intelligent body progress tracker that uses AI + 3D visualization to help users analyze, compare, and reach their ideal physique over time.

![BodyTrack AI Screenshot](https://images.pexels.com/photos/4498294/pexels-photo-4498294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

---

## 🚀 Features

### 🤖 AI Analysis
- Upload body photo → receive analysis
- Muscle group balance report
- Body type classification (e.g., Dadbod, Athletic)
- Personalized training suggestions

### 🎯 Target Physique Goals
- Select from templates:
  - 💼 Dadbod Deluxe
  - 💪 Bodybuilder Beast
  - 🏃 Athletic Shred
  - 🛡 Strongman Tank
- See your progress toward that goal visually

### 📊 Progress Tracking
- Track weight, measurements, and AI feedback
- Visualize data trends over time
- Compare previous and current states

### 🧍‍♂️ Interactive 3D Model
- Rotatable, responsive 3D body model
- Side-by-side with your goal physique
- Visual progress overlays (e.g. muscle growth)

---

## 🔧 Stack

| Tool | Purpose |
|------|---------|
| **React (TypeScript)** | UI & state management |
| **TensorFlow.js** | AI photo/body analysis |
| **Three.js** | 3D body visualization |
| **Tailwind CSS** | Styling |
| **Lucide Icons** | Iconography |

---

## 🧭 User Flow

1. **Upload Photo or Enter Measurements**
2. **AI Analyzes Body Composition**
3. **User Selects Goal Physique**
4. **3D Model Updates + Metrics Shown**
5. **Track Over Time + Get AI Tips**

---

## 🧱 Current Dev Progress

- [x] AIAnalysis UI (muscle feedback, strengths, suggestions)
- [x] Component styling with Tailwind
- [x] Types defined (`AIFeedback`, `MuscleAnalysis`)
- [ ] AI backend connection
- [ ] Image-to-body analysis (TensorFlow.js)
- [ ] 3D model visualization (Three.js)
- [ ] Dashboard layout + mobile views

---

## 📦 Getting Started (Local Dev)

```bash
# Clone the repo
git clone https://github.com/yourusername/bodytrack-ai.git

# Install dependencies
npm install

# Start the dev server
npm run dev

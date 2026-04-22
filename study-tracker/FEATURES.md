# ELITE STUDY TRACKER - Premium Edition

## System Overview
A high-end, AI-powered study tracking platform with goal-based personalization for Indian board exams and competitive entrance exams.

## Key Features

### 1. GOAL-BASED SYSTEM
Six different exam goals with customized targets:
- **ICSE Class 10**: 8 hrs/day, 12 hour daily target
- **CBSE Class 10**: 8 hrs/day, 12 hour daily target
- **CBSE Class 11**: 10 hrs/day, 14 hour daily target (1.15x multiplier)
- **CBSE Class 12**: 12 hrs/day, 16 hour daily target (1.25x multiplier)
- **JEE Mains**: 14 hrs/day, 18 hour daily target (1.40x multiplier)
- **JEE Advanced**: 15 hrs/day, 20 hour daily target (1.60x multiplier)

### 2. INTELLIGENT SCORING
- Score = (Study Time / Total Time) × 100 × Goal Multiplier
- Capped at 100%
- Higher difficulty goals get score multipliers for motivation

### 3. AI-POWERED STUDY TIPS
- **Goal-Specific**: Different tips for JEE vs Board exams
- **Performance-Based**: Tips vary based on today's score
- **Time-Based**: Recommendations adjust based on hours studied
- **Subject-Specific**: Math, Physics, Chemistry, Biology, English tips

### 4. PREMIUM UI/UX
- Modern dark gradient theme
- Glassmorphism effects
- Smooth animations & transitions
- Fully responsive design
- High contrast for visibility

### 5. ANALYTICS & TRACKING
- Daily score tracking
- 7-day average calculation
- Streak counter (70%+ streak)
- Performance charts
- Historical data visualization

## User Flow

1. **LOGIN/SIGNUP** → Login page (optional email/password)
2. **GOAL SELECTION** → Choose your exam goal
3. **DASHBOARD** → See today's score, streak, progress bar
4. **ADD DATA** → Log study/distraction hours + subject
5. **ANALYSIS** → Get score + personalized AI tips
6. **HISTORY** → View trends and previous sessions

## Scoring Examples

### For ICSE Class 10 (1.0x multiplier):
- 6 hrs study, 1 hr social, 1 hr other = 6/8 × 100 = 75%

### For JEE Mains (1.40x multiplier):
- 8 hrs study, 1 hr social, 1 hr other = 8/10 × 100 × 1.40 = 112% → capped at 100%
- 10 hrs study, 1 hr social, 1 hr other = 10/12 × 100 × 1.40 = 116% → capped at 100%

### For JEE Advanced (1.60x multiplier):
- 12 hrs study, 1 hr social, 1 hr other = 12/14 × 100 × 1.60 = 137% → capped at 100%

## Data Storage
- **LocalStorage**: User profile, goals, study logs
- **Ready for Supabase**: Database integration for cloud sync

## Files Structure
- login.html - Authentication page
- goals.html - Goal selection (appears after signup/login)
- index.html - Dashboard with analytics
- entry.html - Daily study data entry
- history.html - Historical data & charts
- script.js - All logic and AI recommendations
- style.css - Premium design system

## Performance Targets by Goal

| Goal | Daily Target | Total Hours | Multiplier |
|------|-------------|-------------|-----------|
| ICSE 10 | 8 hrs | 12 hrs | 1.0x |
| CBSE 10 | 8 hrs | 12 hrs | 1.0x |
| CBSE 11 | 10 hrs | 14 hrs | 1.15x |
| CBSE 12 | 12 hrs | 16 hrs | 1.25x |
| JEE Mains | 14 hrs | 18 hrs | 1.40x |
| JEE Advanced | 15 hrs | 20 hrs | 1.60x |

## AI Tip Categories
1. Time-based suggestions (based on hours studied)
2. Goal-specific strategies (exam-focused)
3. Subject-specific tips (Math, Physics, etc.)
4. Distraction management (phone usage reduction)
5. Performance motivation (based on score level)

---
**Created**: April 2026
**Version**: 1.0 Premium Edition

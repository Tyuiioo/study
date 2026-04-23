# STUDY TRACKER - Goal-Based Study Management

## QUICK START

### Setup (1 min)
1. Open index.html in browser
2. Sign up with email/password
3. Select your goal (6 options)
4. Start logging your study!

### Goal Options
- ICSE Class 10 (8h/day target)
- CBSE Class 10 (8h/day target)
- CBSE Class 11 (7h/day target)
- CBSE Class 12 (10h/day target)
- JEE Mains (9h/day target)
- JEE Advanced (12h/day target)

## HOW IT WORKS

1. **LOG** your study hours, distraction time, subject
2. **GET** AI tips & score based on your goal
3. **TRACK** progress on dashboard
4. **VIEW** trends in history
5. **CHANGE** goal anytime

## SCORING

Score = Based on hitting your goal's target hours
- 100%: Hit target with no distractions
- 90%+: 1h+ above minimum
- 70-90%: At or above minimum
- <70%: Below target, needs push

Distraction time reduces score 3 points per excess hour.

## SUPABASE SETUP (Optional)

1. Go to supabase.com - Sign up free
2. Create project, get URL + Key
3. Create table:
   CREATE TABLE user_goals (
     email TEXT PRIMARY KEY,
     goal TEXT NOT NULL,
     updated_at TIMESTAMP DEFAULT now()
   );
4. In script.js, update lines 2-3 with your credentials

## FILES

- index.html: Sign up/login
- goals.html: Choose your goal
- dashboard.html: Dashboard
- entry.html: Log study data
- history.html: View progress
- script.js: All logic + Supabase
- style.css: Premium UI design

## FEATURES

✅ 6 Goal types with different targets
✅ Dynamic scoring (adapts to goal)
✅ 5+ personalized AI tips per session
✅ Goal-specific strategies
✅ Subject-specific recommendations
✅ Beautiful dark UI with animations
✅ Charts & performance tracking
✅ 70+ day streak counter
✅ Offline mode (LocalStorage)
✅ Mobile responsive
✅ Supabase integration

## AI TIPS COVER

- Time management (Pomodoro, breaks)
- Study techniques (spaced rep, active recall)
- Goal-specific strategies
- Subject-specific approaches
- Distraction management
- Motivation & consistency

## CUSTOMIZE

Change colors in script.js GOALS object:
'JEE-ADVANCED': { color: '#dc2626' }

Modify target hours:
'JEE-ADVANCED': { targetHours: 12 }

Add new goals with same structure.

## TECHNICAL

- Frontend: HTML5, CSS3, JavaScript
- Auth: Supabase (optional)
- Database: Supabase PostgreSQL (optional)
- Storage: Browser LocalStorage
- Charts: Chart.js
- Works offline with localStorage!

## BROWSER SUPPORT

✅ Chrome, Firefox, Safari, Edge
✅ Mobile & Tablet
✅ All modern browsers

## TIPS

1. Set realistic daily targets
2. Log data every day for accuracy
3. Use AI tips to improve
4. Check history weekly for trends
5. Celebrate streaks!

---
Version 2.0 (Goal-Based System)
Premium Study Tracker - Made for Serious Learners! 🚀

# StudyTracker Elite - Premium Study Management System

## Features
- Goal-based study tracking (ICSE Class 10, CBSE Class 10/11/12, JEE Mains/Advanced)
- Personalized scoring system based on exam targets
- AI-powered study tips tailored to your goal
- Real-time progress tracking & charts
- Streak monitoring
- Weekly performance analytics
- Supabase integration for cloud storage

## Setup Instructions

### 1. Supabase Configuration
- Create account at https://supabase.com
- Create new project
- Get your Supabase URL and Anon Key
- Open script.js and replace:
  \const SUPABASE_URL = 'your-url';\
  \const SUPABASE_ANON_KEY = 'your-key';\



### 3. Run Locally
- Open login.html in browser
- Create account or login
- Select your exam goal
- Start tracking!

## Goals & Daily Targets
- ICSE Class 10: 4 hours/day
- CBSE Class 10: 4 hours/day
- CBSE Class 11: 5 hours/day
- CBSE Class 12: 5 hours/day
- JEE Mains: 7 hours/day
- JEE Advanced: 8 hours/day

## Scoring System
- Score = (Study Time / Daily Target) × 70% + (Focus Score) × 30%
- Focus Score = 100 - (Distraction Time / Study Time) × 50
- Maximum Score: 100%

## File Structure
- login.html: Authentication page
- goal-select.html: Goal selection after login
- index.html: Main dashboard
- entry.html: Log study sessions
- history.html: View historical data & charts
- script.js: All logic & functions
- style.css: Premium styling

## Tips for Best Results
1. Log study sessions daily
2. Track distraction time honestly
3. Set realistic goals
4. Review AI tips regularly
5. Aim for 90%+ score daily
6. Maintain 7+ day streak

## Contact
For issues or feature requests, create an issue on GitHub.

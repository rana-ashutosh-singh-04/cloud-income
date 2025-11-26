/** @type {import('tailwindcss').Config} */
export default {
content: [
'./index.html',
'./src/**/*.{js,jsx,ts,tsx}',
],
theme: {
extend: {
colors: {
primary: '#4F46E5', // Indigo-like (PhonePe-ish feel)
ink: '#0F172A',
soft: '#F1F5F9',
},
boxShadow: {
card: '0 8px 24px rgba(15, 23, 42, 0.08)'
},
},
},
plugins: [],
}
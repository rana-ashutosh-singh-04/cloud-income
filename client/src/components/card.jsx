export default function Card({ className = '', children }) {
return (
<div className={`bg-white rounded-2xl shadow-card p-4 ${className}`}>{children}</div>
)
}
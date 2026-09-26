export default function FeatureCard({ icon, title, description, colorClass }) {
  return (
    <div className="card">
      <div className={`card-icon ${colorClass || 'blue'}`}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

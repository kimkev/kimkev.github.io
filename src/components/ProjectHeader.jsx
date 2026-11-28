import './ProjectHeader.css';

const ProjectHeader = ({ title, description, tags = [], source }) => (
  <header className="project-header">
    <h1>{title}</h1>
    <p className="project-header-description">{description}</p>
    <p className="project-header-meta">
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
      {source && (
        <a className="project-source" href={source} target="_blank" rel="noreferrer">
          View source<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}
    </p>
  </header>
);

export default ProjectHeader;

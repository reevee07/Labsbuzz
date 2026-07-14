import './Card.css';

const Card = ({ children, className = '', hoverable = false, padded = true, ...rest }) => {
  const classes = [
    'lb-card',
    hoverable ? 'lb-card--hoverable' : '',
    padded ? 'lb-card--padded' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Card;

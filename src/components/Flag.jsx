function Flag({ code, size = 'medium', className = '' }) {
  const sizes = {
    small: 32,
    medium: 64,
    large: 96,
    xlarge: 128
  }

  const pixelSize = sizes[size] || sizes.medium

  return (
    <img 
      src={`/flags/${code}.png`}
      alt={`${code} flag`}
      className={`flag-image ${className}`}
      style={{ width: pixelSize, height: 'auto', borderRadius: '4px' }}
      onError={(e) => {
        e.target.style.display = 'none'
      }}
    />
  )
}

export default Flag

// Global click listener to handle ripple effect on buttons
document.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  // Calculate click position within the button
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Set CSS variables for ripple coordinates
  button.style.setProperty('--x', `${x}px`);
  button.style.setProperty('--y', `${y}px`);
});
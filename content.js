// Function to apply styles to shaka-video elements
function applyShakaVideoStyles() {
  const videos = document.querySelectorAll('video.shaka-video');
  
  videos.forEach(video => {
    // Check if styles are already applied to avoid redundant operations
    if (!video.dataset.enlargerApplied) {
      video.style.position = 'relative';
      video.style.left = '-2.5%';
      video.style.top = '-2.5%';
      video.style.width = '105%';
      video.style.height = '105%';
      video.dataset.enlargerApplied = 'true';
      console.log('Inflearn Video Enlarger: Styles applied to video element');
    }
  });
  
  // Apply padding-top: 0px to shaka-video-container
  const containers = document.querySelectorAll('div.shaka-video-container');
  
  containers.forEach(container => {
    if (!container.dataset.paddingApplied) {
      container.style.paddingTop = '0px';
      container.dataset.paddingApplied = 'true';
      console.log('Inflearn Video Enlarger: padding-top applied to container');
    }
  });
}

// Apply styles immediately
applyShakaVideoStyles();

// Create a MutationObserver to watch for dynamically added video elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      applyShakaVideoStyles();
    }
  });
});

// Start observing the document for DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also reapply on page load completion
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyShakaVideoStyles);
} else {
  applyShakaVideoStyles();
}

console.log('Inflearn Video Enlarger: Extension loaded and monitoring');

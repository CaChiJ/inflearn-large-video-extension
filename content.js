// 기본 설정값
const DEFAULT_SETTINGS = {
  enabled: true,
  zoomLevel: 105
};

let currentSettings = { ...DEFAULT_SETTINGS };

// 스타일 적용 함수
function applyShakaVideoStyles(settings) {
  if (!settings.enabled) {
    removeStyles();
    return;
  }

  const videos = document.querySelectorAll('video.shaka-video');
  const zoomPercent = settings.zoomLevel;
  const offset = (zoomPercent - 100) / 2; // 중앙 정렬을 위한 offset 계산
  
  videos.forEach(video => {
    video.style.position = 'relative';
    video.style.left = `-${offset}%`;
    video.style.top = `-${offset}%`;
    video.style.width = `${zoomPercent}%`;
    video.style.height = `${zoomPercent}%`;
    video.dataset.enlargerApplied = 'true';
  });
  
  // padding-top 제거
  const containers = document.querySelectorAll('div.shaka-video-container');
  containers.forEach(container => {
    container.style.paddingTop = '0px';
    container.dataset.paddingApplied = 'true';
  });
  
  console.log(`Inflearn Video Enlarger: Styles applied (${zoomPercent}%)`);
}

// 스타일 제거 함수
function removeStyles() {
  const videos = document.querySelectorAll('video.shaka-video');
  
  videos.forEach(video => {
    if (video.dataset.enlargerApplied) {
      video.style.position = '';
      video.style.left = '';
      video.style.top = '';
      video.style.width = '';
      video.style.height = '';
      delete video.dataset.enlargerApplied;
    }
  });
  
  const containers = document.querySelectorAll('div.shaka-video-container');
  containers.forEach(container => {
    if (container.dataset.paddingApplied) {
      container.style.paddingTop = '';
      delete container.dataset.paddingApplied;
    }
  });
  
  console.log('Inflearn Video Enlarger: Styles removed');
}

// 설정 로드 및 적용
function loadAndApplySettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    currentSettings = settings;
    applyShakaVideoStyles(settings);
  });
}

// MutationObserver 설정
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length && currentSettings.enabled) {
      applyShakaVideoStyles(currentSettings);
    }
  });
});

// DOM 변경 감지 시작
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 페이지 로드 시 설정 로드 및 적용
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndApplySettings);
} else {
  loadAndApplySettings();
}

// popup에서 설정 변경 메시지 수신
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_SETTINGS') {
    currentSettings = message.settings;
    applyShakaVideoStyles(message.settings);
    sendResponse({ success: true });
  }
});

console.log('Inflearn Video Enlarger: Extension loaded and monitoring');

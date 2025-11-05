// 기본 설정값
const DEFAULT_SETTINGS = {
  enabled: true,
  zoomLevel: 105,
  hideFooter: true
};

// 설정 로드
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    document.getElementById('enableToggle').checked = settings.enabled;
    document.getElementById('zoomSlider').value = settings.zoomLevel;
    document.getElementById('zoomValue').textContent = settings.zoomLevel + '%';
    document.getElementById('hideFooterToggle').checked = settings.hideFooter;
  });
}

// 설정 저장
function saveSettings() {
  const enabled = document.getElementById('enableToggle').checked;
  const zoomLevel = parseInt(document.getElementById('zoomSlider').value);
  const hideFooter = document.getElementById('hideFooterToggle').checked;
  
  const settings = { enabled, zoomLevel, hideFooter };
  
  chrome.storage.sync.set(settings, () => {
    // 상태 메시지 표시
    const status = document.getElementById('status');
    status.style.color = '#00c471';
    status.textContent = '설정이 저장되었습니다';
    
    setTimeout(() => {
      status.style.color = '#888';
    }, 1500);
    
    // 현재 열려있는 inflearn 탭에 메시지 전송
    chrome.tabs.query({ url: '*://*.inflearn.com/courses/lecture*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'UPDATE_SETTINGS',
          settings: settings
        }).catch(() => {
          // 탭이 준비되지 않았을 수 있으므로 에러 무시
        });
      });
    });
  });
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  // 활성화 토글
  document.getElementById('enableToggle').addEventListener('change', saveSettings);
  
  // Footer 숨김 토글
  document.getElementById('hideFooterToggle').addEventListener('change', saveSettings);
  
  // 확대율 슬라이더
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomValue = document.getElementById('zoomValue');
  
  zoomSlider.addEventListener('input', (e) => {
    zoomValue.textContent = e.target.value + '%';
  });
  
  zoomSlider.addEventListener('change', saveSettings);
});

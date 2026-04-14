document.addEventListener('DOMContentLoaded', () => {
  fetch('left.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('left').innerHTML = data;
      })
      .catch(error => {
        console.error('Left load failed:', error);
      });


  // 탭 메뉴 기능
  const tabs = document.querySelectorAll('.tab-menu li');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      contents.forEach(content => {
        content.id === target ? content.classList.add('active') : content.classList.remove('active');
      });
    });
  });



  // 갤러리 페이지네이션 기능
  const wrapper = document.querySelector('.gallery-list-wrapper');
  const pages = document.querySelectorAll('.gallery-list-row');
  const prevBtn = document.querySelector('.pagination li.prev');
  const nextBtn = document.querySelector('.pagination li.next');
  const pageButtons = document.querySelectorAll('.pagination li:not(.prev):not(.next)');

  const pageCount = pages.length;
  let currentIndex = 0;

  // wrapper 너비 및 각 페이지 너비 자동 설정
  wrapper.style.width = `${pageCount * 100}%`;
  pages.forEach(page => {
    page.style.width = `${100 / pageCount}%`;
  });

  function showPage(index) {
    if (index < 0) index = 0;
    if (index >= pageCount) index = pageCount - 1;

    // translateX 값을 계산하여 슬라이드 위치 설정 (음수 값)
    const translateXValue = - (100 / pageCount) * index;
    wrapper.style.transform = `translateX(${translateXValue}%)`;

    pageButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    currentIndex = index;

    if (prevBtn) {
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    }
    if (nextBtn) {
      nextBtn.style.opacity = currentIndex === pageCount - 1 ? '0.3' : '1';
      nextBtn.style.pointerEvents = currentIndex === pageCount - 1 ? 'none' : 'auto';
    }
  }

  pageButtons.forEach((button, idx) => {
    button.addEventListener('click', () => {
      showPage(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) showPage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < pageCount - 1) showPage(currentIndex + 1);
    });
  }

  // 초기 페이지 표시
  showPage(0);
});



  // 페이지 로드 완료 후 opacity를 1로 전환
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });

// 링크 클릭 시 opacity를 0으로 전환 후 실제 페이지 이동
document.querySelectorAll('a').forEach(link => {
link.addEventListener('click', function(e) {
  if (this.target === '_blank') return; // 새 탭은 그대로
  e.preventDefault();
  const href = this.href;
  document.body.classList.remove('loaded');
  setTimeout(() => {
    window.location.href = href;
  }, 75);
  });
});



  // 모바일 헤더
  /* JavaScript 함수: 메뉴 열기/닫기 */
  function toggleMenu() {
    const overlay = document.getElementById('menuOverlay');
    const navbar = document.querySelector('.navbar');

    // overlay 열리고 닫힘 상태 토글
    if (overlay.classList.contains('open')) {
    overlay.classList.remove('open');
    navbar.classList.remove('active');
    } else {
    overlay.classList.add('open');
    navbar.classList.add('active');
    }
  }



//
(function () {
  const emailEl = document.getElementById('email-copy');
  const toastEl = document.getElementById('toast');
  const email = 'box102design@gmail.com';

  function showToast(message) {
    if (!toastEl) return alert(message);
    toastEl.textContent = message;
    toastEl.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toastEl.style.display = 'none';
    }, 1800);
  }

  async function copyEmail() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = email;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      showToast('이메일이 복사되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('복사에 실패했습니다. 길게 눌러 복사하세요.');
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyEmail();
    }
  }

  if (emailEl) {
    emailEl.addEventListener('click', copyEmail);
    emailEl.addEventListener('keydown', handleKeydown);
  } else {
    // 요소가 아직 안 만들어진 경우 대비
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('email-copy');
      if (el) {
        el.addEventListener('click', copyEmail);
        el.addEventListener('keydown', handleKeydown);
      }
    });
  }
})();



// 카페 슬라이더
(function() {
  const visual = document.querySelector('.cafe-visual');
  const track = visual.querySelector('.slider-track');
  const slides = Array.from(track.children);
  const prevBtn = visual.querySelector('.nav.prev');
  const nextBtn = visual.querySelector('.nav.next');

  let index = 0;
  const last = slides.length - 1;

  // 드래그 상태
  let dragging = false;
  let startX = 0;
  let deltaX = 0;
  const THRESHOLD = 50; // 민감도(픽셀)
  let activePointerId = null; // 캡처 해제용

  function setTransition(on) {
    track.style.transition = on ? 'transform 0.35s ease' : 'none';
  }

  function applyTranslate(px) {
    track.style.transform = `translateX(calc(${-index * 100}% + ${px}px))`;
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, last));
    setTransition(true);
    track.style.transform = `translateX(-${index * 100}%)`;
    updateNavState();
  }

  function updateNavState() {
    const atFirst = index === 0;
    const atLast = index === last;

    if (prevBtn) {
      prevBtn.classList.toggle('is-disabled', atFirst);
      prevBtn.toggleAttribute('disabled', atFirst);
      prevBtn.setAttribute('aria-disabled', String(atFirst));
    }
    if (nextBtn) {
      nextBtn.classList.toggle('is-disabled', atLast);
      nextBtn.toggleAttribute('disabled', atLast);
      nextBtn.setAttribute('aria-disabled', String(atLast));
    }
  }

  // 버튼 클릭(드래그와 분리)
  prevBtn?.addEventListener('click', (e) => {
    if (prevBtn.hasAttribute('disabled')) return;
    goTo(index - 1);
  });
  nextBtn?.addEventListener('click', (e) => {
    if (nextBtn.hasAttribute('disabled')) return;
    goTo(index + 1);
  });

  function isOnNav(target) {
    return target && target.closest && target.closest('.nav');
  }

  // 공통 드래그 시작
  function dragStart(clientX, target, pointerId) {
    // 버튼에서 시작하면 드래그 무시 → 버튼 클릭 정상 동작
    if (isOnNav(target)) return;

    dragging = true;
    startX = clientX;
    deltaX = 0;
    setTransition(false);
    visual.classList.add('dragging');

    if (pointerId != null && visual.setPointerCapture) {
      activePointerId = pointerId;
      visual.setPointerCapture(pointerId);
    }
  }

  // 공통 드래그 이동
  function dragMove(clientX) {
    if (!dragging) return;
    deltaX = clientX - startX;

    // 양끝 저항감
    const atFirst = index === 0 && deltaX > 0;
    const atLast = index === last && deltaX < 0;
    const resist = (atFirst || atLast) ? 0.35 : 1;
    applyTranslate(deltaX * resist);
  }

  // 공통 드래그 종료
  function dragEnd() {
    if (!dragging) return;
    dragging = false;
    setTransition(true);

    if (Math.abs(deltaX) > THRESHOLD) {
      if (deltaX < 0 && index < last) goTo(index + 1);
      else if (deltaX > 0 && index > 0) goTo(index - 1);
      else goTo(index);
    } else {
      goTo(index);
    }

    // 포인터 캡처 해제
    if (activePointerId != null && visual.releasePointerCapture) {
      try { visual.releasePointerCapture(activePointerId); } catch (_) {}
      activePointerId = null;
    }

    deltaX = 0;
    visual.classList.remove('dragging');
  }

  // Pointer Events 우선
if (window.PointerEvent) {
  visual.addEventListener('pointerdown', (e) => {
    const isPrimary = (e.pointerType === 'mouse') ? e.button === 0 : true;
    if (!isPrimary) return;
    dragStart(e.clientX, e.target, e.pointerId);
  });
  visual.addEventListener('pointermove', (e) => dragMove(e.clientX));
  visual.addEventListener('pointerup', dragEnd);
  visual.addEventListener('pointercancel', dragEnd);
  // pointerleave는 캡처 미사용 상황에서만 필요
  visual.addEventListener('pointerleave', () => {
    // 캡처가 없고 드래깅 중일 때만 종료
    // activePointerId는 클로저 변수(기존 코드)
    if (!activePointerId && dragging) dragEnd();
  });
} else {
  // 마우스 폴백
  visual.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragStart(e.clientX, e.target, null);
  });
  window.addEventListener('mousemove', (e) => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);

  // 터치 폴백: passive:false로 변경
  visual.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) return; // 멀티터치 방지
    dragStart(e.touches[0].clientX, e.target, null);
  }, { passive: true }); // start는 passive여도 무관

  visual.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    e.preventDefault(); // 수평 드래그 중 스크롤 방지
    dragMove(e.touches[0].clientX);
  }, { passive: false });

  visual.addEventListener('touchend', dragEnd);
  visual.addEventListener('touchcancel', dragEnd);
}

  // 초기화
  goTo(0);
})();

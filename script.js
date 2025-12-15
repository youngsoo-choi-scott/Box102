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
      e.preventDefault();
      const href = this.href;
      document.body.classList.remove('loaded'); // opacity 1 -> 0
      setTimeout(() => {
        window.location.href = href;
      }, 75); // transition 시간과 동일하게 설정
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

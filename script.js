/*
 * ----------------------------------------
 * サイト全体の初期化
 * ----------------------------------------
 */
document.addEventListener('DOMContentLoaded', function() {
    // 1. 共通パーツの読み込み
    loadHtmlComponent('_header.html', '#header-placeholder', () => {
        // ヘッダー読み込み完了後に実行
        initializeHamburgerMenu();
        highlightActiveNav();
    });
    
    loadHtmlComponent('_footer.html', '#footer-placeholder');

    // 2. スクロール連動エフェクトの初期化
    initializeScrollAnimations();
    initializeHeaderScrollEffect();

    // 3. ウィンドウリサイズ処理の初期化 (★ バグ修正のため追加)
    initializeResizeHandler();
});

/*
 * ----------------------------------------
 * 1. 共通HTMLパーツの読み込み (ヘッダー/フッター)
 * ----------------------------------------
 */
function loadHtmlComponent(url, targetSelector, callback) {
    const placeholder = document.querySelector(targetSelector);
    if (!placeholder) return;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok for ${url}`);
            return response.text();
        })
        .then(data => {
            placeholder.innerHTML = data;
            if (callback) callback(); // 読み込み完了後にコールバック実行
        })
        .catch(error => {
            console.error(`Error fetching ${url}:`, error);
            placeholder.innerHTML = `<p style="color:red; text-align:center;">${url} の読み込みに失敗しました。</p>`;
        });
}

/*
 * ----------------------------------------
 * 2. ハンバーガーメニュー (ヘッダー読み込み後に実行)
 * ----------------------------------------
 */
function initializeHamburgerMenu() {
    const btn = document.getElementById('hamburger-btn');
    const nav = document.getElementById('global-nav');

    if (btn && nav) {
        btn.addEventListener('click', function() {
            const isOpen = btn.classList.toggle('is-open');
            nav.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', isOpen);
            
            // bodyにクラスをトグルして、背景のスクロールを制御
            document.body.classList.toggle('nav-open');
        });
    }
}

/*
 * ----------------------------------------
 * 3. アクティブなナビゲーションのハイライト (ヘッダー読み込み後に実行)
 * ----------------------------------------
 */
function highlightActiveNav() {
    // 現在のページのファイル名を取得 (例: "student.html" や "")
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('#global-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // index.html の場合 (currentPath が "" または "index.html")
        if ((currentPath === "" || currentPath === "index.html") && linkPath === "index.html") {
            link.classList.add('is-active');
        } 
        // その他のページ
        else if (currentPath !== "" && currentPath === linkPath) {
            link.classList.add('is-active');
        }
    });
}

/*
 * ----------------------------------------
 * 4. スクロールアニメーション (Intersection Observer)
 * ----------------------------------------
 */
function initializeScrollAnimations() {
    const targets = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // 1回表示したら監視を終了
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // 10%見えたらトリガー
        });

        targets.forEach(target => {
            observer.observe(target);
        });
    } else {
        // フォールバック (Intersection Observer 非対応ブラウザ)
        targets.forEach(target => {
            target.classList.add('is-visible');
        });
    }
}

/*
 * ----------------------------------------
 * 5. ヘッダーのスクロールエフェクト
 * ----------------------------------------
 */
function initializeHeaderScrollEffect() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // 50pxスクロールしたら
            headerPlaceholder.classList.add('is-scrolled');
        } else {
            headerPlaceholder.classList.remove('is-scrolled');
        }
    }, { passive: true }); // スクロールパフォーマンス向上のため
}

/*
 * ----------------------------------------
 * 6. ウィンドウリサイズ時の処理 (★ バグ修正)
 * (ハンバーガーメニューのクリーンアップ)
 * ----------------------------------------
 */
function initializeResizeHandler() {
    window.addEventListener('resize', () => {
        const btn = document.getElementById('hamburger-btn');
        const nav = document.getElementById('global-nav');
        
        // PC幅 (769px以上) になったときにメニューが開いていたら閉じる
        if (window.innerWidth > 768 && nav && nav.classList.contains('is-open')) {
            btn.classList.remove('is-open');
            nav.classList.remove('is-open');
            btn.setAttribute('aria-expanded', false);
            document.body.classList.remove('nav-open');
        }
    });
}
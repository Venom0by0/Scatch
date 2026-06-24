(function () {
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');

    function isDark() {
        return root.classList.contains('dark');
    }

    function updateIcon() {
        if (!icon) return;
        icon.className = isDark()
            ? 'ri-sun-line text-lg'
            : 'ri-moon-line text-lg';
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        updateIcon();
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            setTheme(isDark() ? 'light' : 'dark');
        });
    }

    updateIcon();
})();

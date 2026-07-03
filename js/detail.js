"use strict";
// ============================================================
//  课程详情页 JS
// ============================================================
(function () {
    'use strict';
    // 从 URL 获取课程 ID
    const params = new URLSearchParams(window.location.search);
    const courseId = parseInt(params.get('id') || '0', 10);
    const container = document.getElementById('detailContainer');
    function renderError() {
        container.innerHTML = `
            <div class="detail-error">
                <span class="emoji">😅</span>
                <h3>未找到该课程</h3>
                <p>课程 ID 无效或不存在，请返回课程列表重新选择。</p>
                <a href="index.html" class="retry-link">← 返回课程列表</a>
            </div>
        `;
    }
    function renderLoading() {
        container.innerHTML = `
            <div class="detail-loading">
                <span class="emoji">⏳</span>
                <h3>加载中...</h3>
            </div>
        `;
    }
    function renderCourse(course) {
        const ageLabel = getAgeLabel(course.ageGroup);
        const ageCls = getAgeClass(course.ageGroup);
        const careerLabel = getCareerLabel(course.career);
        const careerCls = getCareerClass(course.career);
        const knowledgeHtml = course.knowledge.map(k => '<span class="knowledge-tag">' + k + '</span>').join('');
        const isLoggedIn = typeof AuthManager !== 'undefined' && AuthManager.isLoggedIn();
        let lessonsHtml = '';
        course.lessons.forEach(lesson => {
            const enterBtn = isLoggedIn 
                ? `<a href="lesson.html?course=${course.id}&lesson=${lesson.num}" class="lesson-enter-btn">🚀 进入学习</a>`
                : `<button class="lesson-enter-btn lesson-locked" onclick="showLoginPrompt()">🔒 登录后学习</button>`;
            lessonsHtml += `
                <div class="detail-lesson-item">
                    <div class="lesson-header">
                        <span class="lesson-num">第${lesson.num}课</span>
                        <span class="lesson-topic">${lesson.topic}</span>
                        ${enterBtn}
                    </div>
                    <div class="lesson-detail">
                        <div><span class="label">🎯 目标</span> ${lesson.goal}</div>
                        <div><span class="label-outcome">📦 成果物</span> ${lesson.outcome}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = `
            <!-- 课程主信息 -->
            <div class="detail-main">
                <div class="top-tags">
                    <span class="course-id">${course.code}</span>
                    <span class="age-tag ${ageCls}">${ageLabel}</span>
                    <span class="career-tag ${careerCls}">${careerLabel}</span>
                </div>
                <div class="detail-icon">${course.icon}</div>
                <h1 class="detail-title">${course.title}</h1>
                <div class="detail-meta">
                    <span>📅 ${ageLabel}</span>
                    <span>${careerLabel}</span>
                    <span>⏱ 4小课 × 60分钟</span>
                </div>
                <div class="detail-desc">${course.desc}</div>

                <div class="detail-knowledge">${knowledgeHtml}</div>

                <!-- 关联说明 -->
                <div class="detail-relation">
                    <strong>🔗 与AI机器人开发的关联：</strong><br/>
                    ${course.relation}
                </div>
            </div>

            <!-- 小课列表 -->
            <h2 class="detail-lessons-title">
                📖 小课规划
                <span class="badge">${course.lessons.length}课时 · 每课60分钟</span>
            </h2>
            ${lessonsHtml}
        `;
    }
    // --- 入口 ---
    renderLoading();
    // 验证课程 ID
    if (isNaN(courseId) || courseId < 1 || courseId > coursesData.length) {
        renderError();
        return;
    }
    const course = coursesData.find(c => c.id === courseId);
    if (!course) {
        renderError();
        return;
    }
    // 更新页面标题
    document.title = course.title + ' - AI机器人·成长营';
    // 渲染
    renderCourse(course);

    // 登录提示弹窗
    window.showLoginPrompt = function() {
        let overlay = document.getElementById('loginOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loginOverlay';
            overlay.className = 'auth-overlay';
            overlay.innerHTML = `
                <div class="auth-card">
                    <div class="auth-card-header">
                        <div class="auth-card-icon">🤖</div>
                        <h2>AI 机器人成长营</h2>
                        <p>登录后即可学习全部 48 节互动课件</p>
                    </div>
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">登 录</button>
                        <button class="auth-tab" data-tab="register">注 册</button>
                        <div class="auth-tab-indicator"></div>
                    </div>
                    <div class="auth-card-body">
                        <form id="loginForm" class="auth-form active">
                            <div class="auth-input-group">
                                <span class="auth-input-icon">👤</span>
                                <input type="text" id="loginUser" placeholder="用户名">
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">🔒</span>
                                <input type="password" id="loginPass" placeholder="密码">
                            </div>
                            <div class="auth-msg" id="authMsg"></div>
                            <button type="button" class="auth-submit-btn" id="loginSubmitBtn">登 录</button>
                        </form>
                        <form id="registerForm" class="auth-form">
                            <div class="auth-input-group">
                                <span class="auth-input-icon">👤</span>
                                <input type="text" id="regUser" placeholder="用户名（用于登录）">
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">🔒</span>
                                <input type="password" id="regPass" placeholder="密码（至少4位）">
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">😊</span>
                                <input type="text" id="regName" placeholder="昵称（选填）">
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">📝</span>
                                <input type="text" id="regRealName" placeholder="真实姓名 *">
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">⚧</span>
                                <select id="regGender" class="auth-select">
                                    <option value="">请选择性别 *</option>
                                    <option value="男">男</option>
                                    <option value="女">女</option>
                                </select>
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">🏫</span>
                                <input type="text" id="regSchool" placeholder="就读学校 *">
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">🎓</span>
                                <select id="regGrade" class="auth-select">
                                    <option value="">请选择在读年级 *</option>
                                    <option value="K1">K1（幼儿园小班）</option>
                                    <option value="K2">K2（幼儿园中班）</option>
                                    <option value="K3">K3（幼儿园大班）</option>
                                    <option value="G1">G1（一年级）</option>
                                    <option value="G2">G2（二年级）</option>
                                    <option value="G3">G3（三年级）</option>
                                    <option value="G4">G4（四年级）</option>
                                    <option value="G5">G5（五年级）</option>
                                    <option value="G6">G6（六年级）</option>
                                    <option value="G7">G7（初一）</option>
                                    <option value="G8">G8（初二）</option>
                                    <option value="G9">G9（初三）</option>
                                    <option value="G10">G10（高一）</option>
                                    <option value="G11">G11（高二）</option>
                                    <option value="G12">G12（高三）</option>
                                </select>
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">📱</span>
                                <input type="tel" id="regPhone" placeholder="手机号（选填）">
                            </div>
                            <div class="auth-input-group">
                                <span class="auth-input-icon">📧</span>
                                <input type="email" id="regEmail" placeholder="电子邮箱（选填）">
                            </div>
                            <div class="auth-msg" id="regMsg"></div>
                            <button type="button" class="auth-submit-btn" id="regSubmitBtn">注 册</button>
                        </form>
                    </div>
                    <button class="auth-close-btn" id="authCloseBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);

            // Tab切换
            const tabs = overlay.querySelectorAll('.auth-tab');
            const forms = overlay.querySelectorAll('.auth-form');
            const indicator = overlay.querySelector('.auth-tab-indicator');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    tabs.forEach(t => t.classList.remove('active'));
                    forms.forEach(f => f.classList.remove('active'));
                    this.classList.add('active');
                    if (this.dataset.tab === 'login') {
                        overlay.querySelector('#loginForm').classList.add('active');
                        indicator.classList.remove('right');
                    } else {
                        overlay.querySelector('#registerForm').classList.add('active');
                        indicator.classList.add('right');
                    }
                });
            });

            overlay.querySelector('#authCloseBtn').addEventListener('click', function() {
                overlay.style.display = 'none';
            });
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) overlay.style.display = 'none';
            });

            // 登录
            overlay.querySelector('#loginSubmitBtn').addEventListener('click', function() {
                const u = overlay.querySelector('#loginUser').value.trim();
                const p = overlay.querySelector('#loginPass').value;
                const msg = overlay.querySelector('#authMsg');
                if (!u || !p) { msg.textContent = '请填写用户名和密码'; msg.className = 'auth-msg'; return; }
                AuthManager.login(u, p).then(function(result) {
                    if (result.success) {
                        msg.textContent = '✅ 登录成功！';
                        msg.className = 'auth-msg success';
                        setTimeout(function() { location.reload(); }, 800);
                    } else {
                        msg.textContent = '❌ ' + result.message;
                        msg.className = 'auth-msg';
                    }
                }).catch(function() {
                    msg.textContent = '❌ 网络错误，请重试';
                    msg.className = 'auth-msg';
                });
            });

            // 注册
            overlay.querySelector('#regSubmitBtn').addEventListener('click', function() {
                const u = overlay.querySelector('#regUser').value.trim();
                const n = overlay.querySelector('#regName').value.trim();
                const p = overlay.querySelector('#regPass').value;
                const realName = overlay.querySelector('#regRealName').value.trim();
                const gender = overlay.querySelector('#regGender').value;
                const school = overlay.querySelector('#regSchool').value.trim();
                const grade = overlay.querySelector('#regGrade').value;
                const phone = overlay.querySelector('#regPhone').value.trim();
                const email = overlay.querySelector('#regEmail').value.trim();
                const msg = overlay.querySelector('#regMsg');
                if (!u || !p) { msg.textContent = '请填写用户名和密码'; msg.className = 'auth-msg'; return; }
                if (p.length < 4) { msg.textContent = '密码至少4位'; msg.className = 'auth-msg'; return; }
                if (!realName) { msg.textContent = '请填写真实姓名'; msg.className = 'auth-msg'; return; }
                if (!gender) { msg.textContent = '请选择性别'; msg.className = 'auth-msg'; return; }
                if (!school) { msg.textContent = '请填写就读学校'; msg.className = 'auth-msg'; return; }
                if (!grade) { msg.textContent = '请选择在读年级'; msg.className = 'auth-msg'; return; }
                AuthManager.register({
                    username: u,
                    password: p,
                    nickname: n || u,
                    realName: realName,
                    gender: gender,
                    school: school,
                    grade: grade,
                    phone: phone,
                    email: email
                }).then(function(result) {
                    if (result.success) {
                        msg.textContent = '✅ 注册成功！';
                        msg.className = 'auth-msg success';
                        setTimeout(function() { location.reload(); }, 800);
                    } else {
                        msg.textContent = '❌ ' + result.message;
                        msg.className = 'auth-msg';
                    }
                }).catch(function() {
                    msg.textContent = '❌ 网络错误，请重试';
                    msg.className = 'auth-msg';
                });
            });
        }
        overlay.style.display = 'flex';
    };
})();
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
        let lessonsHtml = '';
        course.lessons.forEach(lesson => {
            lessonsHtml += `
                <div class="detail-lesson-item">
                    <div class="lesson-header">
                        <span class="lesson-num">第${lesson.num}课</span>
                        <span class="lesson-topic">${lesson.topic}</span>
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
})();
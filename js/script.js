"use strict";
// ============================================================
//  AI机器人成长营 - 主脚本
// ============================================================
const state = {
    ageFilter: 'all',
    careerFilter: 'all',
    knowledgeFilter: 'all',
    viewMode: 'card',
    filterVisible: false,
};
// ============================================================
//  DOM 引用
// ============================================================
const grid = document.getElementById('courseGrid');
const emptyState = document.getElementById('emptyState');
const courseCount = document.getElementById('courseCount');
const totalCourseCount = document.getElementById('totalCourseCount');
const viewCardBtn = document.getElementById('viewCardBtn');
const viewListBtn = document.getElementById('viewListBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const filterSection = document.getElementById('filterSection');
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterStatus = document.getElementById('filterStatus');
const ageBtns = document.querySelectorAll('.age-btn');
const careerBtns = document.querySelectorAll('.career-btn');
const knowledgeBtnGroup = document.getElementById('knowledgeBtnGroup');
// ============================================================
//  生成知识点按钮
// ============================================================
function renderKnowledgeButtons() {
    knowledgeBtnGroup.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn knowledge-btn active';
    allBtn.dataset.knowledge = 'all';
    allBtn.textContent = '全部';
    knowledgeBtnGroup.appendChild(allBtn);
    sortedKnowledge.forEach(k => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn knowledge-btn';
        btn.dataset.knowledge = k;
        btn.textContent = k;
        knowledgeBtnGroup.appendChild(btn);
    });
    knowledgeBtnGroup.querySelectorAll('.knowledge-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            knowledgeBtnGroup.querySelectorAll('.knowledge-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.knowledgeFilter = this.dataset.knowledge || 'all';
            render();
        });
    });
}
// ============================================================
//  筛选函数
// ============================================================
function filterCourses() {
    return coursesData.filter(c => {
        const matchAge = state.ageFilter === 'all' || c.ageGroup === state.ageFilter;
        const matchCareer = state.careerFilter === 'all' || c.career === state.careerFilter;
        const matchKnowledge = state.knowledgeFilter === 'all' || c.knowledge.includes(state.knowledgeFilter);
        return matchAge && matchCareer && matchKnowledge;
    });
}
// ============================================================
//  筛选栏切换
// ============================================================
function toggleFilter(show) {
    const visible = (show !== undefined) ? show : !state.filterVisible;
    state.filterVisible = visible;
    if (visible) {
        filterSection.classList.remove('hidden');
        filterToggleBtn.classList.add('active');
        filterToggleBtn.innerHTML = '<span>\u{1F53D}</span> 隐藏筛选 <span class="arrow">\u25B2</span>';
        filterStatus.textContent = '\u7B5B\u9009\u5DF2\u5C55\u5F00';
    }
    else {
        filterSection.classList.add('hidden');
        filterToggleBtn.classList.remove('active');
        filterToggleBtn.innerHTML = '<span>\u{1F50D}</span> 显示筛选 <span class="arrow">\u25BC</span>';
        filterStatus.textContent = '\u7B5B\u9009\u5DF2\u9690\u85CF';
    }
}
// ============================================================
//  渲染课程
// ============================================================
function render() {
    const filtered = filterCourses();
    const total = filtered.length;
    courseCount.textContent = String(total);
    totalCourseCount.textContent = String(coursesData.length);
    if (total === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        grid.style.display = 'none';
        return;
    }
    emptyState.style.display = 'none';
    grid.style.display = '';
    grid.className = 'course-grid' + (state.viewMode === 'list' ? ' list-view' : '');
    let html = '';
    filtered.forEach((course, index) => {
        const ageLabel = getAgeLabel(course.ageGroup);
        const ageCls = getAgeClass(course.ageGroup);
        const careerCls = getCareerClass(course.career);
        const careerLabel = getCareerLabel(course.career);
        const knowledgeHtml = course.knowledge.map(k => '<span class="knowledge-tag">' + k + '</span>').join('');
        html += '<div class="course-card" style="animation-delay:' + (index * 0.04).toFixed(2) + 's">' +
            '<div class="top-row"><div class="left-tags">' +
            '<span class="course-id">' + course.code + '</span>' +
            '<span class="age-tag ' + ageCls + '">' + ageLabel + '</span></div>' +
            '<span class="career-tag ' + careerCls + '">' + careerLabel + '</span></div>' +
            '<div class="course-icon">' + course.icon + '</div>' +
            '<div class="course-title" data-id="' + course.id + '">' + course.title + '</div>' +
            '<div class="course-desc">' + course.desc + '</div>' +
            '<div class="knowledge-wrap">' + knowledgeHtml + '</div>' +
            '<div style="margin-top:4px;font-size:12px;color:var(--ink3);display:flex;align-items:center;gap:6px;">' +
            '<span>\u{1F4D6} 4\u5C0F\u8BFE</span>' +
            '<span style="opacity:0.4;">\u00B7</span>' +
            '<span>\u23F1 \u6BCF\u8BFE60\u5206\u949F</span></div></div>';
    });
    grid.innerHTML = html;
    // 点击课程标题 -> 跳转到独立详情页
    grid.querySelectorAll('.course-title').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.currentTarget;
            const id = parseInt(target.dataset.id || '0', 10);
            window.location.href = 'course-detail.html?id=' + id;
        });
    });
    // 点击课程卡片任意处也跳转
    grid.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.course-title'))
                return;
            const titleEl = card.querySelector('.course-title');
            if (titleEl) {
                const id = parseInt(titleEl.dataset.id || '0', 10);
                window.location.href = 'course-detail.html?id=' + id;
            }
        });
        card.style.cursor = 'pointer';
    });
    document.querySelectorAll('.view-toggle button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === state.viewMode);
    });
}
// ============================================================
//  事件绑定
// ============================================================
filterToggleBtn.addEventListener('click', () => { toggleFilter(); });
viewCardBtn.addEventListener('click', () => {
    if (state.viewMode === 'card')
        return;
    state.viewMode = 'card';
    render();
});
viewListBtn.addEventListener('click', () => {
    if (state.viewMode === 'list')
        return;
    state.viewMode = 'list';
    render();
});
ageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ageFilter = btn.dataset.age || 'all';
        render();
    });
});
careerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        careerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.careerFilter = btn.dataset.career || 'all';
        render();
    });
});
clearFiltersBtn.addEventListener('click', () => {
    ageBtns.forEach(b => b.classList.remove('active'));
    const allAgeBtn = document.querySelector('.age-btn[data-age="all"]');
    if (allAgeBtn)
        allAgeBtn.classList.add('active');
    state.ageFilter = 'all';
    careerBtns.forEach(b => b.classList.remove('active'));
    const allCareerBtn = document.querySelector('.career-btn[data-career="all"]');
    if (allCareerBtn)
        allCareerBtn.classList.add('active');
    state.careerFilter = 'all';
    knowledgeBtnGroup.querySelectorAll('.knowledge-btn').forEach(b => b.classList.remove('active'));
    const allKnowledgeBtn = knowledgeBtnGroup.querySelector('.knowledge-btn[data-knowledge="all"]');
    if (allKnowledgeBtn)
        allKnowledgeBtn.classList.add('active');
    state.knowledgeFilter = 'all';
    render();
});
// ============================================================
//  初始化
// ============================================================
renderKnowledgeButtons();
render();
toggleFilter(false);
console.log('\u{1F916} AI\u673A\u5668\u4EBA\u6210\u957F\u8425 \u5DF2\u542F\u52A8\uFF01 \u5171 ' + coursesData.length + ' \u95E8\u8BFE\u7A0B\uFF0C\u6BCF\u95E84\u5C0F\u8BFE');
console.log('\u{1F4CB} \u7F16\u53F7: R01-R04 (5-8\u5C81), R05-R08 (9-12\u5C81), R09-R12 (13\u5C81+)');
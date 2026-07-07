"use strict";
// ============================================================
//  AI机器人·成长营 — 用户认证系统
//  基于服务器端 API 的登录/注册/权限管理
//  支持管理员激活用户功能
//  支持本地开发模式（无 PHP 服务器时自动启用 Mock API）
// ============================================================

const Auth = (function() {
    'use strict';

    const API_URL = 'api/auth.php';
    const SESSION_KEY = 'airobot_session';
    const DEV_USERS_KEY = 'airobot_dev_users';

    // ---------- 开发模式检测 ----------
    // 策略：默认 Mock，只有明确的生产域名才走真实 PHP
    var _useMock = true; // 默认 Mock，安全第一

    (function detectMode() {
        try {
            if (typeof window === 'undefined') return;
            var host = (window.location && window.location.hostname) || '';
            // 生产环境域名白名单 — 只有这些域名走真实 PHP API
            if (host === 'airobot.zengqi.site' || host === 'www.airobot.zengqi.site') {
                _useMock = false;
            }
        } catch(e) {
            // 检测失败，保持 Mock 模式
        }
    })();

    function isDevMode() {
        return _useMock;
    }

    // ---------- Mock 用户数据库（仅开发模式） ----------
    function getMockUsers() {
        try {
            var stored = localStorage.getItem(DEV_USERS_KEY);
            if (stored) return JSON.parse(stored);
        } catch(e) {}
        // 默认 mock 数据
        var defaults = {
            'admin': {
                password: 'admin123',
                nickname: '管理员',
                realName: '曾老师',
                gender: '男',
                school: '-',
                grade: '-',
                phone: '',
                email: '',
                role: 'admin',
                active: true,
                createdAt: Date.now(),
                lastLogin: null
            },
            'student': {
                password: '1234',
                nickname: '小明',
                realName: '小明',
                gender: '男',
                school: '阳光小学',
                grade: '一年级',
                phone: '',
                email: '',
                role: 'user',
                active: true,
                createdAt: Date.now(),
                lastLogin: null
            }
        };
        try {
            localStorage.setItem(DEV_USERS_KEY, JSON.stringify(defaults));
        } catch(e) {}
        return defaults;
    }

    function saveMockUsers(users) {
        try {
            localStorage.setItem(DEV_USERS_KEY, JSON.stringify(users));
        } catch(e) {}
    }

    // ---------- Mock API（开发模式） ----------
    function mockApi(action, data) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                var users = getMockUsers();
                var result;

                switch (action) {
                    case 'register':
                        var uname = (data.username || '').trim().toLowerCase();
                        if (!uname || !data.password) {
                            result = {success:false, message:'用户名和密码不能为空'};
                        } else if (users[uname]) {
                            result = {success:false, message:'用户名已存在'};
                        } else {
                            users[uname] = {
                                password: data.password,
                                nickname: data.nickname || uname,
                                realName: data.realName || '',
                                gender: data.gender || '',
                                school: data.school || '',
                                grade: data.grade || '',
                                phone: data.phone || '',
                                email: data.email || '',
                                role: 'user',
                                active: false,
                                createdAt: Date.now(),
                                lastLogin: null
                            };
                            saveMockUsers(users);
                            result = {success:true, message:'注册成功，请等待管理员激活'};
                        }
                        break;

                    case 'login':
                        var lu = (data.username || '').trim().toLowerCase();
                        var lp = data.password || '';
                        if (!users[lu]) {
                            result = {success:false, message:'用户名或密码错误'};
                        } else if (users[lu].password !== lp) {
                            result = {success:false, message:'用户名或密码错误'};
                        } else if (users[lu].role !== 'admin' && !users[lu].active) {
                            result = {success:false, message:'账号待激活，请联系管理员'};
                        } else {
                            users[lu].lastLogin = Date.now();
                            saveMockUsers(users);
                            result = {
                                success:true,
                                message:'登录成功',
                                user: {
                                    username: lu,
                                    nickname: users[lu].nickname,
                                    role: users[lu].role,
                                    active: users[lu].active
                                }
                            };
                        }
                        break;

                    case 'users':
                        var session = getSession();
                        if (!session || !users[session.username] || users[session.username].role !== 'admin') {
                            result = {success:false, message:'无权限'};
                        } else {
                            var userList = [];
                            Object.keys(users).forEach(function(un) {
                                var u = users[un];
                                userList.push({
                                    username: un,
                                    nickname: u.nickname,
                                    realName: u.realName || '',
                                    gender: u.gender || '',
                                    school: u.school || '',
                                    grade: u.grade || '',
                                    phone: u.phone || '',
                                    email: u.email || '',
                                    role: u.role || 'user',
                                    active: u.active !== false,
                                    createdAt: u.createdAt,
                                    lastLogin: u.lastLogin
                                });
                            });
                            result = {success:true, users: userList};
                        }
                        break;

                    case 'activate':
                        var aSession = getSession();
                        if (!aSession || !users[aSession.username] || users[aSession.username].role !== 'admin') {
                            result = {success:false, message:'无权限'};
                        } else if (!users[data.username]) {
                            result = {success:false, message:'用户不存在'};
                        } else {
                            users[data.username].active = true;
                            saveMockUsers(users);
                            result = {success:true, message:'用户已激活'};
                        }
                        break;

                    case 'deactivate':
                        var dSession = getSession();
                        if (!dSession || !users[dSession.username] || users[dSession.username].role !== 'admin') {
                            result = {success:false, message:'无权限'};
                        } else if (!users[data.username]) {
                            result = {success:false, message:'用户不存在'};
                        } else if (users[data.username].role === 'admin') {
                            result = {success:false, message:'不能停用管理员账户'};
                        } else {
                            users[data.username].active = false;
                            saveMockUsers(users);
                            result = {success:true, message:'用户已停用'};
                        }
                        break;

                    case 'delete':
                        var delSession = getSession();
                        if (!delSession || !users[delSession.username] || users[delSession.username].role !== 'admin') {
                            result = {success:false, message:'无权限'};
                        } else if (!users[data.username]) {
                            result = {success:false, message:'用户不存在'};
                        } else if (users[data.username].role === 'admin') {
                            result = {success:false, message:'不能删除管理员账户'};
                        } else {
                            delete users[data.username];
                            saveMockUsers(users);
                            result = {success:true, message:'用户已删除'};
                        }
                        break;

                    default:
                        result = {success:false, message:'Invalid action'};
                }
                resolve(result);
            }, 200);
        });
    }

    // ---------- 会话管理（本地仅存会话信息） ----------
    function getSession() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY));
        } catch(e) {
            return null;
        }
    }

    function saveSession(session) {
        try {
            if (session) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            } else {
                localStorage.removeItem(SESSION_KEY);
            }
        } catch(e) {}
    }

    function getSessionToken() {
        const session = getSession();
        if (!session) return '';
        return btoa(unescape(encodeURIComponent(JSON.stringify(session))));
    }

    function apiRequest(action, data) {
        if (_useMock) return mockApi(action, data);

        // 生产环境 — 真实 PHP API
        var headers = { 'Content-Type': 'application/json' };
        var token = getSessionToken();
        if (token) headers['X-Session'] = token;
        return fetch(API_URL + '?action=' + action, {
            method: 'POST',
            headers: headers,
            body: data ? JSON.stringify(data) : undefined
        }).then(function(res) { return res.json(); })
        .catch(function(err) {
            _useMock = true;
            return mockApi(action, data);
        });
    }

    function apiGet(action) {
        if (_useMock) return mockApi(action);

        var headers = { 'Content-Type': 'application/json' };
        var token = getSessionToken();
        if (token) headers['X-Session'] = token;
        return fetch(API_URL + '?action=' + action, {
            method: 'GET',
            headers: headers
        }).then(function(res) { return res.json(); })
        .catch(function(err) {
            _useMock = true;
            return mockApi(action);
        });
    }

    // ---------- 公开 API ----------
    return {
        /** 注册新用户（异步） */
        register: function(data) {
            return apiRequest('register', data);
        },

        /** 登录（异步） */
        login: function(username, password) {
            return apiRequest('login', {
                username: username,
                password: password
            }).then(function(result) {
                if (result.success && result.user) {
                    saveSession({
                        username: result.user.username,
                        nickname: result.user.nickname,
                        role: result.user.role,
                        loginTime: Date.now()
                    });
                }
                return result;
            });
        },

        /** 退出登录 */
        logout: function() {
            saveSession(null);
        },

        /** 获取当前登录用户信息 */
        currentUser: function() {
            return getSession();
        },

        /** 是否已登录 */
        isLoggedIn: function() {
            return getSession() !== null;
        },

        /** 获取当前用户昵称 */
        getNickname: function() {
            const session = getSession();
            return session ? session.nickname : '访客';
        },

        /** 获取当前用户完整信息 */
        getCurrentUser: function() {
            return getSession();
        },

        /** 检查当前用户是否为管理员 */
        isAdmin: function() {
            const session = getSession();
            return session && session.role === 'admin';
        },

        /** 获取所有用户列表（异步，仅管理员可用） */
        getAllUsers: function() {
            return apiGet('users');
        },

        /** 激活用户（异步，仅管理员可用） */
        activateUser: function(username) {
            return apiRequest('activate', { username: username });
        },

        /** 停用用户（异步，仅管理员可用） */
        deactivateUser: function(username) {
            return apiRequest('deactivate', { username: username });
        },

        /** 删除用户（异步，仅管理员可用） */
        deleteUser: function(username) {
            return apiRequest('delete', { username: username });
        },

        /** 检查是否在开发模式 */
        isMockMode: function() {
            return isDevMode();
        }
    };
})();

// 兼容别名
const AuthManager = Auth;

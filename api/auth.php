<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 用户数据文件
$usersFile = __DIR__ . '/users.json';

// 读取用户数据
function getUsers() {
    global $usersFile;
    if (!file_exists($usersFile)) {
        return [];
    }
    $content = file_get_contents($usersFile);
    return json_decode($content, true) ?: [];
}

// 保存用户数据
function saveUsers($users) {
    global $usersFile;
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// 初始化管理员账户
function initAdmin() {
    $users = getUsers();
    if (!isset($users['admin'])) {
        $users['admin'] = [
            'password' => 'admin123',
            'nickname' => '管理员',
            'role' => 'admin',
            'active' => true,
            'createdAt' => time() * 1000,
            'lastLogin' => null
        ];
        saveUsers($users);
    }
}

// 获取请求数据
function getInput() {
    $json = file_get_contents('php://input');
    return json_decode($json, true) ?: [];
}

// 返回 JSON 响应
function respond($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// 初始化管理员
initAdmin();

// 获取请求方法和路径
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// 路由处理
switch ($action) {
    case 'register':
        if ($method !== 'POST') {
            respond(['success' => false, 'message' => 'Method not allowed']);
        }
        $input = getInput();
        $username = isset($input['username']) ? trim(strtolower($input['username'])) : '';
        $password = isset($input['password']) ? $input['password'] : '';
        $nickname = isset($input['nickname']) ? $input['nickname'] : '';
        $realName = isset($input['realName']) ? $input['realName'] : '';
        $gender = isset($input['gender']) ? $input['gender'] : '';
        $school = isset($input['school']) ? $input['school'] : '';
        $grade = isset($input['grade']) ? $input['grade'] : '';
        $phone = isset($input['phone']) ? $input['phone'] : '';
        $email = isset($input['email']) ? $input['email'] : '';
        
        if (!$username || !$password) {
            respond(['success' => false, 'message' => '用户名和密码不能为空']);
        }
        if (strlen($username) < 2) {
            respond(['success' => false, 'message' => '用户名至少2个字符']);
        }
        if (strlen($password) < 4) {
            respond(['success' => false, 'message' => '密码至少4个字符']);
        }
        if (!$realName) {
            respond(['success' => false, 'message' => '请填写真实姓名']);
        }
        if (!$gender) {
            respond(['success' => false, 'message' => '请选择性别']);
        }
        if (!$school) {
            respond(['success' => false, 'message' => '请填写就读学校']);
        }
        if (!$grade) {
            respond(['success' => false, 'message' => '请选择在读年级']);
        }
        
        $users = getUsers();
        if (isset($users[$username])) {
            respond(['success' => false, 'message' => '用户名已存在']);
        }
        
        $users[$username] = [
            'password' => $password,
            'nickname' => $nickname ?: $username,
            'realName' => $realName,
            'gender' => $gender,
            'school' => $school,
            'grade' => $grade,
            'phone' => $phone,
            'email' => $email,
            'role' => 'user',
            'active' => false,
            'createdAt' => time() * 1000,
            'lastLogin' => null
        ];
        saveUsers($users);
        respond(['success' => true, 'message' => '注册成功，请等待管理员激活']);
        break;
        
    case 'login':
        if ($method !== 'POST') {
            respond(['success' => false, 'message' => 'Method not allowed']);
        }
        $input = getInput();
        $username = isset($input['username']) ? trim(strtolower($input['username'])) : '';
        $password = isset($input['password']) ? $input['password'] : '';
        
        $users = getUsers();
        if (!isset($users[$username])) {
            respond(['success' => false, 'message' => '用户名或密码错误']);
        }
        if ($users[$username]['password'] !== $password) {
            respond(['success' => false, 'message' => '用户名或密码错误']);
        }
        if ($users[$username]['role'] !== 'admin' && !$users[$username]['active']) {
            respond(['success' => false, 'message' => '账号待激活，请联系管理员']);
        }
        
        $users[$username]['lastLogin'] = time() * 1000;
        saveUsers($users);
        
        respond([
            'success' => true,
            'message' => '登录成功',
            'user' => [
                'username' => $username,
                'nickname' => $users[$username]['nickname'],
                'role' => $users[$username]['role'],
                'active' => $users[$username]['active']
            ]
        ]);
        break;
        
    case 'users':
        if ($method !== 'GET') {
            respond(['success' => false, 'message' => 'Method not allowed']);
        }
        // 需要验证管理员身份
        $session = isset($_SERVER['HTTP_X_SESSION']) ? $_SERVER['HTTP_X_SESSION'] : '';
        if (!$session) {
            respond(['success' => false, 'message' => '未登录']);
        }
        
        $sessionData = json_decode(base64_decode($session), true);
        if (!$sessionData || !isset($sessionData['username'])) {
            respond(['success' => false, 'message' => '会话无效']);
        }
        
        $users = getUsers();
        if (!isset($users[$sessionData['username']]) || $users[$sessionData['username']]['role'] !== 'admin') {
            respond(['success' => false, 'message' => '无权限']);
        }
        
        $userList = [];
        foreach ($users as $uname => $u) {
            $userList[] = [
                'username' => $uname,
                'nickname' => $u['nickname'],
                'realName' => isset($u['realName']) ? $u['realName'] : '',
                'gender' => isset($u['gender']) ? $u['gender'] : '',
                'school' => isset($u['school']) ? $u['school'] : '',
                'grade' => isset($u['grade']) ? $u['grade'] : '',
                'phone' => isset($u['phone']) ? $u['phone'] : '',
                'email' => isset($u['email']) ? $u['email'] : '',
                'role' => isset($u['role']) ? $u['role'] : 'user',
                'active' => isset($u['active']) ? $u['active'] : false,
                'createdAt' => $u['createdAt'],
                'lastLogin' => $u['lastLogin']
            ];
        }
        respond(['success' => true, 'users' => $userList]);
        break;
        
    case 'activate':
        if ($method !== 'POST') {
            respond(['success' => false, 'message' => 'Method not allowed']);
        }
        $session = isset($_SERVER['HTTP_X_SESSION']) ? $_SERVER['HTTP_X_SESSION'] : '';
        if (!$session) {
            respond(['success' => false, 'message' => '未登录']);
        }
        
        $sessionData = json_decode(base64_decode($session), true);
        if (!$sessionData || !isset($sessionData['username'])) {
            respond(['success' => false, 'message' => '会话无效']);
        }
        
        $users = getUsers();
        if (!isset($users[$sessionData['username']]) || $users[$sessionData['username']]['role'] !== 'admin') {
            respond(['success' => false, 'message' => '无权限']);
        }
        
        $input = getInput();
        $targetUser = isset($input['username']) ? $input['username'] : '';
        if (!isset($users[$targetUser])) {
            respond(['success' => false, 'message' => '用户不存在']);
        }
        
        $users[$targetUser]['active'] = true;
        saveUsers($users);
        respond(['success' => true, 'message' => '用户已激活']);
        break;
        
    case 'deactivate':
        if ($method !== 'POST') {
            respond(['success' => false, 'message' => 'Method not allowed']);
        }
        $session = isset($_SERVER['HTTP_X_SESSION']) ? $_SERVER['HTTP_X_SESSION'] : '';
        if (!$session) {
            respond(['success' => false, 'message' => '未登录']);
        }
        
        $sessionData = json_decode(base64_decode($session), true);
        if (!$sessionData || !isset($sessionData['username'])) {
            respond(['success' => false, 'message' => '会话无效']);
        }
        
        $users = getUsers();
        if (!isset($users[$sessionData['username']]) || $users[$sessionData['username']]['role'] !== 'admin') {
            respond(['success' => false, 'message' => '无权限']);
        }
        
        $input = getInput();
        $targetUser = isset($input['username']) ? $input['username'] : '';
        if (!isset($users[$targetUser])) {
            respond(['success' => false, 'message' => '用户不存在']);
        }
        if ($users[$targetUser]['role'] === 'admin') {
            respond(['success' => false, 'message' => '不能停用管理员账户']);
        }
        
        $users[$targetUser]['active'] = false;
        saveUsers($users);
        respond(['success' => true, 'message' => '用户已停用']);
        break;
        
    case 'delete':
        if ($method !== 'POST') {
            respond(['success' => false, 'message' => 'Method not allowed']);
        }
        $session = isset($_SERVER['HTTP_X_SESSION']) ? $_SERVER['HTTP_X_SESSION'] : '';
        if (!$session) {
            respond(['success' => false, 'message' => '未登录']);
        }
        
        $sessionData = json_decode(base64_decode($session), true);
        if (!$sessionData || !isset($sessionData['username'])) {
            respond(['success' => false, 'message' => '会话无效']);
        }
        
        $users = getUsers();
        if (!isset($users[$sessionData['username']]) || $users[$sessionData['username']]['role'] !== 'admin') {
            respond(['success' => false, 'message' => '无权限']);
        }
        
        $input = getInput();
        $targetUser = isset($input['username']) ? $input['username'] : '';
        if (!isset($users[$targetUser])) {
            respond(['success' => false, 'message' => '用户不存在']);
        }
        if ($users[$targetUser]['role'] === 'admin') {
            respond(['success' => false, 'message' => '不能删除管理员账户']);
        }
        
        unset($users[$targetUser]);
        saveUsers($users);
        respond(['success' => true, 'message' => '用户已删除']);
        break;
        
    default:
        respond(['success' => false, 'message' => 'Invalid action']);
}
?>

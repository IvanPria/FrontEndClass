     let currentUser = null;
        let users = []; // In real app, this would be handled by backend

        // Check if user is already logged in (from previous session)
        window.addEventListener('load', function() {
            const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (savedUser) {
                currentUser = savedUser;
                updateUI();
            }
        });

        // Modal functions
        function openModal(type) {
            const modal = document.getElementById(type + 'Modal');
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(type) {
            const modal = document.getElementById(type + 'Modal');
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            clearErrors(type);
        }

        function switchModal(from, to) {
            closeModal(from);
            setTimeout(() => openModal(to), 300);
        }

        // Form validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function validatePassword(password) {
            return password.length >= 6;
        }

        function showError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorDiv = document.getElementById(fieldId + 'Error');
            field.classList.add('error');
            errorDiv.textContent = message;
        }

        function clearError(fieldId) {
            const field = document.getElementById(fieldId);
            const errorDiv = document.getElementById(fieldId + 'Error');
            field.classList.remove('error');
            errorDiv.textContent = '';
        }

        function clearErrors(formType) {
            const fields = formType === 'login' 
                ? ['loginEmail', 'loginPassword']
                : ['signupName', 'signupEmail', 'signupPassword', 'confirmPassword'];
            
            fields.forEach(fieldId => clearError(fieldId));
        }

        // Authentication functions
        function handleLogin(event) {
            event.preventDefault();
            clearErrors('login');

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            let hasError = false;

            // Validation
            if (!validateEmail(email)) {
                showError('loginEmail', 'Email tidak valid');
                hasError = true;
            }

            if (!validatePassword(password)) {
                showError('loginPassword', 'Password minimal 6 karakter');
                hasError = true;
            }

            if (hasError) return;

            // Simulate login (in real app, this would be an API call)
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateUI();
                closeModal('login');
                alert('Login berhasil! Selamat datang, ' + user.name);
            } else {
                showError('loginEmail', 'Email atau password salah');
            }
        }

        function handleSignup(event) {
            event.preventDefault();
            clearErrors('signup');

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            let hasError = false;

            // Validation
            if (name.length < 2) {
                showError('signupName', 'Nama minimal 2 karakter');
                hasError = true;
            }

            if (!validateEmail(email)) {
                showError('signupEmail', 'Email tidak valid');
                hasError = true;
            } else if (users.find(u => u.email === email)) {
                showError('signupEmail', 'Email sudah terdaftar');
                hasError = true;
            }

            if (!validatePassword(password)) {
                showError('signupPassword', 'Password minimal 6 karakter');
                hasError = true;
            }

            if (password !== confirmPassword) {
                showError('confirmPassword', 'Password tidak cocok');
                hasError = true;
            }

            if (hasError) return;

            // Create new user
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password
            };

            users.push(newUser);
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            updateUI();
            closeModal('signup');
            alert('Pendaftaran berhasil! Selamat datang, ' + name);
        }

        function logout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUI();
            closeDropdown();
            alert('Anda telah keluar dari akun');
        }

        // UI update functions
        function updateUI() {
            const authButtons = document.getElementById('authButtons');
            const userAvatar = document.getElementById('userAvatar');
            const userInitial = document.getElementById('userInitial');

            if (currentUser) {
                authButtons.classList.add('hidden');
                userAvatar.classList.remove('hidden');
                userInitial.textContent = currentUser.name.charAt(0).toUpperCase();
            } else {
                authButtons.classList.remove('hidden');
                userAvatar.classList.add('hidden');
            }
        }

        // Dropdown functions
        function toggleDropdown() {
            const dropdown = document.getElementById('userDropdown');
            dropdown.classList.toggle('show');
        }

        function closeDropdown() {
            const dropdown = document.getElementById('userDropdown');
            dropdown.classList.remove('show');
        }

        function showProfile() {
            closeDropdown();
            alert('Fitur profil akan segera hadir!');
        }

        function showSettings() {
            closeDropdown();
            alert('Fitur pengaturan akan segera hadir!');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const userAvatar = document.getElementById('userAvatar');
            const dropdown = document.getElementById('userDropdown');
            
            if (!userAvatar.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Close modal when clicking overlay
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function(event) {
                if (event.target === overlay) {
                    const modalId = overlay.id;
                    const modalType = modalId.replace('Modal', '');
                    closeModal(modalType);
                }
            });
        });

        // Escape key to close modals
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.show').forEach(modal => {
                    const modalType = modal.id.replace('Modal', '');
                    closeModal(modalType);
                });
            }
        });
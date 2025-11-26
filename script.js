document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const topicInput = document.getElementById('topic');
    const courseworkContent = document.getElementById('coursework-content');
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const resultsContent = document.getElementById('results-content');
    const sourcesContainer = document.getElementById('sources-container');

    // Sample sources from cyberleninka.ru (simulated)
    const sampleSources = [
        {
            title: "Методы исследования в современной науке",
            url: "https://cyberleninka.ru/article/n/metody-issledovaniya-v-sovremennoy-nauke",
            author: "Иванов И.И."
        },
        {
            title: "Теоретические основы научного подхода",
            url: "https://cyberleninka.ru/article/n/teoreticheskie-osnovy-nauchnogo-podhoda",
            author: "Петров П.П."
        },
        {
            title: "Анализ современных тенденций в образовании",
            url: "https://cyberleninka.ru/article/n/analiz-sovremennyh-tendenciy-v-obrazovanii",
            author: "Сидоров С.С."
        },
        {
            title: "Практическое применение научных методов",
            url: "https://cyberleninka.ru/article/n/prakticheskoe-primenenie-nauchnyh-metodov",
            author: "Козлова А.А."
        }
    ];

    // Function to simulate fetching data from cyberleninka.ru
    async function fetchFromCyberleninka(topic) {
        // This is a simulation - in a real implementation, you would need to use
        // a server-side proxy or API to fetch data from cyberleninka.ru
        // due to CORS restrictions
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(sampleSources);
            }, 2000);
        });
    }

    // Function to generate course work content
    function generateCourseWork(topic, sources) {
        const introduction = `# Введение\n\nАктуальность темы "${topic}" обусловлена тем, что в современных условиях данная проблематика приобретает всё большее значение. В условиях быстро меняющегося мира, вопросы, связанные с ${topic.toLowerCase()}, требуют всестороннего изучения и анализа.\n\nЦелью данной курсовой работы является комплексное исследование ${topic.toLowerCase()} и выработка рекомендаций по её совершенствованию.\n\nЗадачи курсовой работы:\n1. Изучить теоретические аспекты ${topic.toLowerCase()}\n2. Проанализировать современное состояние проблемы\n3. Рассмотреть практические примеры и кейсы\n4. Сформулировать выводы и рекомендации`;

        const mainPart = `\n\n# Основная часть\n\n## Теоретические основы ${topic.toLowerCase()}\n\nКак отмечают исследователи ${sources.map(s => s.author).slice(0, 2).join(', ')}, ${topic.toLowerCase()} представляет собой комплексную систему, включающую в себя различные аспекты и подходы. В современной научной литературе выделяют несколько ключевых направлений, которые заслуживают особого внимания.\n\n## Анализ современного состояния\n\nНа сегодняшний день ${topic.toLowerCase()} характеризуется следующими тенденциями: во-первых, увеличением значимости; во-вторых, усложнением структуры; в-третьих, ростом требований к качеству. Как подчеркивает ${sources[0].author}, важным аспектом является системный подход к рассмотрению данной проблемы.`;

        const conclusion = `\n\n# Заключение\n\nВ результате проведенного исследования можно сделать следующие выводы:\n\n1. Тема "${topic}" является актуальной и требует дальнейшего изучения\n2. Существуют определенные теоретические и практические аспекты, которые необходимо учитывать\n3. Для эффективного решения проблем в данной области необходим комплексный подход\n\nПерспективы дальнейшего исследования связаны с изучением новых методов и подходов, а также с анализом международного опыта в данной сфере.`;

        return introduction + mainPart + conclusion;
    }

    // Function to display sources
    function displaySources(sources) {
        sourcesContainer.innerHTML = '';
        sources.forEach(source => {
            const sourceElement = document.createElement('div');
            sourceElement.className = 'source-item';
            sourceElement.innerHTML = `
                <div class="source-title">${source.title}</div>
                <div class="source-author">Автор: ${source.author}</div>
                <a href="${source.url}" class="source-url" target="_blank">${source.url}</a>
            `;
            sourcesContainer.appendChild(sourceElement);
        });
    }

    // Function to simulate loading state
    function showLoading() {
        resultsPlaceholder.innerHTML = '<div class="loading">Генерация курсовой работы...</div>';
        resultsPlaceholder.style.display = 'block';
        resultsContent.style.display = 'none';
    }

    // Function to hide loading state
    function hideLoading() {
        resultsPlaceholder.style.display = 'none';
        resultsContent.style.display = 'block';
    }

    // Generate button click handler
    generateBtn.addEventListener('click', async function() {
        const topic = topicInput.value.trim();
        
        if (!topic) {
            alert('Пожалуйста, введите тему курсовой работы');
            return;
        }

        showLoading();

        try {
            // Simulate fetching data from cyberleninka.ru
            const sources = await fetchFromCyberleninka(topic);
            
            // Generate course work content
            const content = generateCourseWork(topic, sources);
            
            // Display the content
            courseworkContent.textContent = content;
            
            // Display sources
            displaySources(sources);
            
            hideLoading();
        } catch (error) {
            console.error('Error generating coursework:', error);
            resultsPlaceholder.innerHTML = '<p>Произошла ошибка при генерации курсовой работы. Пожалуйста, попробуйте снова.</p>';
        }
    });

    // Download button click handler
    downloadBtn.addEventListener('click', function() {
        const topic = topicInput.value.trim() || 'Курсовая работа';
        const content = courseworkContent.textContent;
        
        if (!content) {
            alert('Нет содержимого для скачивания');
            return;
        }

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/[^a-zа-яё0-9]/gi, '_')}_курсовая.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Allow Enter key to trigger generation
    topicInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
});
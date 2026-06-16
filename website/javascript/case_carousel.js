// Air Quality Arena (AQA) Evaluation Plots Carousel functionality

document.addEventListener('DOMContentLoaded', function() {
    // Array holding the metadata and paths for your evaluation plots
    const evaluationPlots = [
        { 
            name: "AQA-Data: AURN Error Distribution (MASE Grid)", 
            file: "aurn_error_mase",
            ext: "png"  
        },
        { 
            name: "AQA-Data: AURN Error Distribution Boxplot Breakdown", 
            file: "aurn_error_mase_box",
            ext: "png"
        },
        { 
            name: "AQA-Bench: CPCB PM2.5 Imputation Analysis Heatmap", 
            file: "cpcb_pm_heatmap",
            ext: "jpeg"
        }
        // { 
        //     name: "AQA-Bench: Normalized MASE Performance across Datasets", 
        //     file: "Normalized_mase_dataset_model",
        //     ext: "png"
        // },
        // { 
        //     name: "AQA-Bench: Normalized MASE Performance across Pollutants", 
        //     file: "Normalized_mase_pollutant_model",
        //     ext: "png"
        // },
        // { 
        //     name: "AQA-Data: AURN Mean MASE Intersection Matrix", 
        //     file: "aurn_mean_mase_pollutant_dataset",
        //     ext: "png"
        // }
    ];

    // Initialize the main plots carousel
    initCarousel('question-carousel', evaluationPlots);
});

function initCarousel(carouselId, cases) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const imageContainer = carousel.querySelector('.case-image-container');
    const title = carousel.querySelector('.case-title');
    const prevBtn = carousel.querySelector('.prev-case');
    const nextBtn = carousel.querySelector('.next-case');
    const counter = carousel.querySelector('.case-counter');

    let currentIndex = 0;

    function updateCase() {
        const currentCase = cases[currentIndex];
        
        // Dynamically matches the image extension (.png or .jpeg) for each plot asset
        imageContainer.innerHTML = `
            <img src="website/img/plots/${currentCase.file}.${currentCase.ext}" 
                 alt="${currentCase.name}" 
                 class="case-image"
                 style="max-width: 95%; max-height: 550px; object-fit: contain;">
        `;
        
        // Update title text string safely
        title.textContent = currentCase.name;
        
        // Update current metric index count
        counter.textContent = `${currentIndex + 1} / ${cases.length}`;
        
        // Update baseline button states gracefully
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === cases.length - 1;
    }

    // Navigation Click listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCase();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cases.length - 1) {
            currentIndex++;
            updateCase();
        }
    });

    // Smart viewport bound Keyboard navigation helper
    document.addEventListener('keydown', (e) => {
        const rect = carousel.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                updateCase();
            } else if (e.key === 'ArrowRight' && currentIndex < cases.length - 1) {
                currentIndex++;
                updateCase();
            }
        }
    });

    // Run baseline execution initialization
    updateCase();
}

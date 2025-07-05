// Global variables to track current selections
let currentSoilType = 'cohesive';
let currentSoilStrata = 'homogeneous';
let currentSaturation = 'saturated';
let currentHeadCondition = 'fixed';
let currentSectionType = 'solid';

// Tab Management System
const tabs = {
    'soil-conditions': document.querySelector('[onclick*="soil-conditions"]'),
    'pile-properties': document.querySelector('[onclick*="pile-properties"]'),
    'loading': document.querySelector('[onclick*="loading"]'),
    'results': document.querySelector('[onclick*="results"]')
};

function initializeTabs() {
    Object.keys(tabs).forEach(tabId => {
        if (tabs[tabId]) {
            tabs[tabId].addEventListener('click', function(e) {
                e.preventDefault();
                openTab(tabId);
            });
        }
    });
}

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    const tabContent = document.getElementById(tabId);
    const tabButton = document.querySelector(`.tab-button[onclick*="${tabId}"]`);

    if (tabContent) tabContent.classList.add('active');
    if (tabButton) tabButton.classList.add('active');
    
    if (tabId === 'results') {
        calculateResults();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            openTab(tabId);
        });
    });

    document.querySelector('.calculate-button').addEventListener('click', calculateResults);
    initializeToggles();
    openTab('soil-conditions');
});

function initializeToggles() {
    document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const funcName = this.getAttribute('onclick').split('(')[0];
            const arg = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            
            switch(funcName) {
                case 'toggleSoilType':
                    toggleSoilType(arg, e);
                    break;
                case 'toggleSoilStrata':
                    toggleSoilStrata(arg, e);
                    break;
                case 'toggleSaturation':
                    toggleSaturation(arg, e);
                    break;
                case 'toggleHeadCondition':
                    toggleHeadCondition(arg, e);
                    break;
                case 'toggleSectionType':
                    toggleSectionType(arg, e);
                    break;
            }
        });
    });

    updateActiveToggles();
    updateInputVisibility();
}

function updateActiveToggles() {
    document.querySelectorAll('.toggle-button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelector(`.toggle-button[onclick*="${currentSoilType}"]`)?.classList.add('active');
    document.querySelector(`.toggle-button[onclick*="${currentSoilStrata}"]`)?.classList.add('active');
    document.querySelector(`.toggle-button[onclick*="${currentSaturation}"]`)?.classList.add('active');
    document.querySelector(`.toggle-button[onclick*="${currentHeadCondition}"]`)?.classList.add('active');
    document.querySelector(`.toggle-button[onclick*="${currentSectionType}"]`)?.classList.add('active');
}

function updateInputVisibility() {
    document.getElementById('cohesive-vars').style.display = 
        currentSoilType === 'cohesive' ? 'block' : 'none';
    document.getElementById('non-cohesive-vars').style.display = 
        currentSoilType === 'non-cohesive' ? 'block' : 'none';

    document.getElementById('homogeneous-vars').style.display = 
        currentSoilStrata === 'homogeneous' ? 'block' : 'none';
    document.getElementById('non-homogeneous-vars').style.display = 
        currentSoilStrata === 'non-homogeneous' ? 'block' : 'none';

    document.getElementById('solid-section-vars').style.display = 
        currentSectionType === 'solid' ? 'block' : 'none';
    document.getElementById('hollow-section-vars').style.display = 
        currentSectionType === 'hollow' ? 'block' : 'none';
    document.getElementById('section-modulus-item').style.display = 
        currentSectionType === 'hollow' ? 'flex' : 'none';
}

function toggleSoilType(type) {
    currentSoilType = type;
    updateActiveToggles();
    updateInputVisibility();
}

function toggleSoilStrata(strata) {
    currentSoilStrata = strata;
    updateActiveToggles();
    updateInputVisibility();
}

function toggleSaturation(saturation) {
    currentSaturation = saturation;
    updateActiveToggles();
}

function toggleHeadCondition(condition) {
    currentHeadCondition = condition;
    updateActiveToggles();
    updateHeadConditionVisualization();
}

function toggleSectionType(type) {
    currentSectionType = type;
    updateActiveToggles();
    updateInputVisibility();
}

function updateHeadConditionVisualization() {
    console.log(`Head condition changed to: ${currentHeadCondition}`);
}

function getSoilParameters() {
    return {
        type: currentSoilType,
        strata: currentSoilStrata,
        saturation: currentSaturation,
        poissonRatio: parseFloat(document.getElementById('poisson-ratio').value) || 0.3,
        unitWeight: parseFloat(document.getElementById('unit-weight').value) || 18,
        cu: currentSoilType === 'cohesive' ? parseFloat(document.getElementById('cu').value) || 50 : null,
        frictionAngle: currentSoilType === 'non-cohesive' ? parseFloat(document.getElementById('friction-angle').value) || 30 : null,
        cuPrime: currentSoilStrata === 'non-homogeneous' ? parseFloat(document.getElementById('cu-prime').value) || 5 : null,
        mValue: currentSoilStrata === 'non-homogeneous' ? parseFloat(document.getElementById('m-value').value) || 2 : null
    };
}

function getPileParameters() {
    const diameter = parseFloat(document.getElementById('pile-diameter').value) / 1000 || 0.5;
    
    let sectionParams;
    if (currentSectionType === 'solid') {
        const fck = parseFloat(document.getElementById('fck').value) || 30;
        const Ep = 22 * Math.pow(fck/10, 0.3) * 1000;
        
        sectionParams = {
            type: 'solid',
            as: parseFloat(document.getElementById('as').value) || 5000,
            fy: parseFloat(document.getElementById('fy').value) || 500,
            fck: fck,
            Ep: Ep,
            longBarDia: parseFloat(document.getElementById('long-bar-dia').value) || 20,
            cover: parseFloat(document.getElementById('cover').value) || 50,
            linkDia: parseFloat(document.getElementById('link-dia').value) || 10,
            noLegs: parseFloat(document.getElementById('no-legs').value) || 4,
            spacing: parseFloat(document.getElementById('spacing').value) || 150
        };
    } else {
        const thickness = parseFloat(document.getElementById('thickness').value) / 1000 || 0.025;
        const externalDia = diameter;
        const internalDia = externalDia - 2 * thickness;
        
        sectionParams = {
            type: 'hollow',
            thickness: thickness,
            steelFy: parseFloat(document.getElementById('steel-fy').value) || 355,
            Ep: parseFloat(document.getElementById('esteel').value) * 1000 || 210000,
            externalDia: externalDia,
            internalDia: internalDia
        };
    }
    
    return {
        length: parseFloat(document.getElementById('pile-length').value) || 10,
        diameter: diameter,
        headCondition: currentHeadCondition,
        sectionType: currentSectionType,
        sectionParams: sectionParams
    };
}

function calculateModifiedEpForSteel(pileParams) {
    if (pileParams.sectionType !== 'hollow') {
        return pileParams.sectionParams.Ep;
    }

    const Esteel = pileParams.sectionParams.Ep;
    const D = pileParams.diameter * 1000;
    const Din = pileParams.sectionParams.internalDia * 1000;
    
    return Esteel * (1 - Math.pow(Din/D, 4));
}

function getLoadingParameters() {
    return {
        lateralLoad: parseFloat(document.getElementById('lateral-load').value) || 100,
        moment: parseFloat(document.getElementById('moment').value) || 50
    };
}

function performCalculations(soil, pile, loading) {
    const results = {};
    
    // Calculate effective Ep (modified for hollow sections)
    results.effectiveEp = (pile.sectionType === 'hollow') 
        ? calculateModifiedEpForSteel(pile) 
        : pile.sectionParams.Ep;
    results.originalEp = pile.sectionParams.Ep;

    // Rest of calculations using results.effectiveEp
    results.pc = soil.strata === 'homogeneous' ? 1 : 0.5;
    
    if (soil.strata === 'homogeneous') {
        const LCo = 10 * pile.diameter;
        const G = (10 + 4 * (LCo)) / 2;
        const Gc1 = G * (1 + 0.75 * soil.poissonRatio);
        
        const Lc1 = pile.diameter * Math.pow(results.effectiveEp / Gc1, 2/7);
        
        const G_final = (10 + 4 * (Lc1)) / 2;
        results.Gc = G_final * (1 + 0.75 * soil.poissonRatio);
        
        results.Lc = pile.diameter * Math.pow(results.effectiveEp / results.Gc, 2/7);
    } else {
        results.mPrime = ((soil.mValue) / 10) * (1 + 0.75 * soil.poissonRatio);
        results.Lc = pile.diameter * Math.pow(2 * results.effectiveEp / (results.mPrime * pile.diameter), 2/9);
        results.Gc = results.pc * results.Lc * results.mPrime;
    }
    
    const LdRatio = pile.length / pile.diameter;
    const threshold = 0.05 * Math.sqrt(results.effectiveEp / results.Gc);
    results.isShortPile = LdRatio <= threshold;
    
    if (soil.type === 'non-cohesive') {
        const phiRad = (soil.frictionAngle || 30) * Math.PI / 180;
        results.Kp = (1 + Math.sin(phiRad)) / (1 - Math.sin(phiRad));
    } else {
        results.Kp = null;
    }
    
    if (results.isShortPile) {
        if (pile.headCondition === 'free') {
            results.maxMoment = soil.strata === 'homogeneous' ? 
                (0.1 / results.pc) * loading.lateralLoad * pile.length :
                (0.148 / results.pc) * loading.lateralLoad * pile.length;
        } else {
            results.maxMoment = -(0.1875 / Math.sqrt(results.pc)) * loading.lateralLoad * pile.length;
        }
        
        const term1 = (0.32 * loading.lateralLoad * Math.pow(pile.diameter / pile.length, 1/3)) / (pile.diameter * results.Gc);
        const term2 = (0.16 * loading.moment * Math.pow(pile.diameter / pile.length, 7/8)) / (results.Gc * Math.pow(pile.diameter, 2));
        results.deflection = (term1 + term2) * 1000;
        
        const term3 = (0.16 * loading.lateralLoad * Math.pow(pile.diameter / pile.length, 7/8)) / (results.Gc * Math.pow(pile.diameter, 2));
        const term4 = (0.25 * loading.moment * Math.pow(pile.diameter / pile.length, 5/3)) / (results.Gc * Math.pow(pile.diameter, 3));
        results.slope = term3 + term4;
    } else {
        if (pile.headCondition === 'free') {
            results.maxMoment = (0.1 / results.pc) * loading.lateralLoad * results.Lc;
            
            const term1 = (0.27 * loading.lateralLoad) / (0.5 * results.Lc);
            const term2 = (4 * loading.moment) / Math.pow(results.Lc, 2);
            const term3 = Math.pow(results.effectiveEp / results.Gc, 1/7) / (results.pc * results.Gc);
            results.deflection = (term1 + term2) * term3 * 1000;
            
            const term4 = Math.pow(results.effectiveEp / (Math.pow(results.Gc, 2) * results.pc), 1/7);
            const term5 = (1.2 * loading.lateralLoad) / Math.pow(results.Lc, 2);
            const term6 = (6.4 * loading.moment * Math.sqrt(results.pc)) / Math.pow(results.Lc, 3);
            results.slope = term4 * (term5 + term6);
        } else {
            results.maxMoment = -(0.1875 / Math.sqrt(results.pc)) * loading.lateralLoad * results.Lc;
            
            const term1 = (0.27 - (0.11 / Math.sqrt(results.pc))) * 2 * loading.lateralLoad / results.Lc;
            const term2 = Math.pow(results.effectiveEp / results.Gc, 1/7) / (results.pc * results.Gc);
            results.deflection = term1 * term2 * 1000;
            results.slope = 0;
        }
    }
    
    results.maxShear = loading.lateralLoad;
    
    if (pile.sectionType === 'solid') {
        const D = pile.diameter * 1000;
        const cover = pile.sectionParams.cover;
        const longBarDia = pile.sectionParams.longBarDia;
        const linkDia = pile.sectionParams.linkDia;
        
        results.effectiveDepth = D - cover - (longBarDia / 2) - (linkDia / 2);
        results.stressBlockDepth = (pile.sectionParams.as * pile.sectionParams.fy) / (0.85 * pile.sectionParams.fck * D);
        results.leverArm = 0.9 * D - results.stressBlockDepth / 2;
        results.momentCapacity = (pile.sectionParams.as * pile.sectionParams.fy * results.leverArm) / (1.5 * 1e9);
        
        results.shearReinforcementArea = pile.sectionParams.noLegs * (Math.PI / 4) * Math.pow(pile.sectionParams.linkDia, 2);
        
        const term1 = 0.17 * Math.sqrt(pile.sectionParams.fck) * D * results.effectiveDepth;
        const term2 = (results.shearReinforcementArea * pile.sectionParams.fy * results.effectiveDepth) / pile.sectionParams.spacing;
        results.shearCapacity = (term1 + term2) / (1.5 * 1e6);
    } else {
        const D = pile.diameter * 1000;
        const t = pile.sectionParams.thickness * 1000;
        const Di = D - 2 * t;
        
        const I = (Math.PI * (Math.pow(D, 4) - Math.pow(Di, 4))) / 64;
        results.sectionModulus = I / (D/2) / 1e9;
        results.momentCapacity = (pile.sectionParams.steelFy * results.sectionModulus) / 1.5;
        
        const Av = Math.PI * D * t;
        results.shearCapacity = (Av * pile.sectionParams.steelFy / Math.sqrt(3)) / (1.5 * 1e6);
    }
    
    if (soil.type === 'cohesive') {
        if (soil.strata === 'homogeneous') {
            results.lateralCapacity = (9 * (soil.cu) * pile.diameter * (results.isShortPile ? pile.length : results.Lc)) / 1500;
        } else {
            results.lateralCapacity = (9 * (soil.cu * (results.isShortPile ? pile.length : results.Lc)) * pile.diameter) / 1500;
        }
    } else {
        const unitWeight = soil.saturation === 'saturated' ? soil.unitWeight - 9.81 : soil.unitWeight;
        results.lateralCapacity = (Math.pow(results.Kp, 2) * unitWeight * pile.diameter * Math.pow((results.isShortPile ? pile.length : results.Lc), 2)) / 1500;
    }
    
    return results;
}

function displayResults(results) {
    const pileParams = getPileParameters();
    
    document.getElementById('gc-result').textContent = results.Gc.toFixed(2);
    
    const kpResult = document.getElementById('kp-result');
    if (results.Kp !== null) {
        kpResult.textContent = results.Kp.toFixed(2);
        kpResult.parentElement.style.display = 'flex';
    } else {
        kpResult.parentElement.style.display = 'none';
    }
    
    document.getElementById('lc-result').textContent = results.Lc.toFixed(2);
    document.getElementById('mmax-result').textContent = Math.abs(results.maxMoment).toFixed(4);
    document.getElementById('vmax-result').textContent = results.maxShear.toFixed(4);
    document.getElementById('yg-result').textContent = Math.abs(results.deflection).toFixed(2);
    document.getElementById('slope-result').textContent = results.slope.toFixed(6);
    
    document.getElementById('mc-result').textContent = results.momentCapacity.toFixed(4);
    document.getElementById('vc-result').textContent = results.shearCapacity.toFixed(4);
    document.getElementById('pu-result').textContent = results.lateralCapacity.toFixed(4);

    if (currentSectionType === 'hollow') {
        document.getElementById('s-result').textContent = results.sectionModulus.toExponential(4);
        document.getElementById('s-result').parentElement.style.display = 'flex';
        
        const steelEpDisplay = `
            Original E<sub>p</sub>: ${results.originalEp.toFixed(0)} MPa<br>
            Modified E<sub>p</sub>: ${results.effectiveEp.toFixed(0)} MPa
        `;
        addAdditionalResult('steel-modulus', 'Elastic Modulus:', steelEpDisplay);
        
        hideElement('effective-depth');
        hideElement('lever-arm');
        hideElement('stress-block');
        hideElement('shear-reinforcement');
    } else {
        const concreteEp = `E<sub>p</sub> = ${pileParams.sectionParams.Ep.toFixed(0)} MPa`;
        addAdditionalResult('concrete-modulus', 'Concrete Elastic Modulus:', concreteEp);
        
        addAdditionalResult('effective-depth', 'Effective Depth (d):', `${results.effectiveDepth.toFixed(1)} mm`);
        addAdditionalResult('lever-arm', 'Lever Arm (z):', `${results.leverArm.toFixed(1)} mm`);
        addAdditionalResult('stress-block', 'Stress Block Depth (a):', `${results.stressBlockDepth.toFixed(1)} mm`);
        addAdditionalResult('shear-reinforcement', 'Shear Reinforcement (Av):', `${results.shearReinforcementArea.toFixed(0)} mm²`);
        
        hideElement('s-result');
    }
    
    if (currentSoilStrata === 'non-homogeneous') {
        addAdditionalResult('m-prime', 'Soil Stiffness Gradient (m\'):', `${results.mPrime.toFixed(4)} MPa/m`);
    } else {
        hideElement('m-prime');
    }

    const lateralCheck = results.lateralCapacity >= parseFloat(document.getElementById('lateral-load').value);
    const shearCheck = results.shearCapacity >= results.maxShear;
    const momentCheck = results.momentCapacity >= Math.abs(results.maxMoment);
    const deflectionCheck = Math.abs(results.deflection) <= 25;
    const slopeCheck = Math.abs(results.slope) <= 0.0175;
    
    displayCheckResult('lateral-check', lateralCheck);
    displayCheckResult('shear-check', shearCheck);
    displayCheckResult('moment-check', momentCheck);
    displayCheckResult('deflection-check', deflectionCheck);
    displayCheckResult('slope-check', slopeCheck);
    
    const recommendations = [];
    
    if (!lateralCheck) recommendations.push({ check: "Lateral Capacity", suggestions: ["Increase pile diameter", "Increase pile length", "Use higher strength concrete", "Add more longitudinal reinforcement"] });
    if (!shearCheck) recommendations.push({ check: "Shear Capacity", suggestions: ["Increase shear link diameter", "Reduce shear link spacing", "Increase number of shear link legs", "Increase concrete grade"] });
    if (!momentCheck) recommendations.push({ check: "Moment Capacity", suggestions: ["Increase longitudinal reinforcement area", "Use higher grade steel", "Increase pile diameter", "Increase concrete strength"] });
    if (!deflectionCheck) recommendations.push({ check: "Deflection", suggestions: ["Increase pile diameter", "Use higher strength concrete", "Increase pile length", "Consider using steel section"] });
    if (!slopeCheck) recommendations.push({ check: "Slope", suggestions: ["Increase pile diameter", "Use fixed head connection", "Increase pile length", "Improve soil stiffness"] });

    displayRecommendations(recommendations);
    console.log("Calculation Results:", results);
}

function addAdditionalResult(id, label, value) {
    let element = document.getElementById(id);
    const resultsGrid = document.querySelector('.results-section:first-child .results-grid');
    
    if (!element && resultsGrid) {
        element = document.createElement('div');
        element.className = 'result-item';
        element.id = id;
        element.innerHTML = `<label>${label}</label><span>${value}</span>`;
        resultsGrid.appendChild(element);
    } else if (element) {
        element.querySelector('span').innerHTML = value;
    }
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}

function displayRecommendations(recommendations) {
    const resultsTab = document.getElementById('results');
    if (!resultsTab) return;

    let recContainer = document.getElementById('recommendations-container');
    
    if (!recContainer) {
        recContainer = document.createElement('div');
        recContainer.className = 'results-section';
        recContainer.id = 'recommendations-container';
        recContainer.innerHTML = `
            <h3>Design Recommendations</h3>
            <div class="recommendations-grid"></div>
        `;
        resultsTab.insertBefore(recContainer, resultsTab.querySelector('.calculate-button'));
    }

    const grid = recContainer.querySelector('.recommendations-grid');
    grid.innerHTML = '';

    if (recommendations.length === 0) {
        grid.innerHTML = '<div class="recommendation-item all-pass">All design checks passed - no modifications needed</div>';
    } else {
        recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <h4>${rec.check} Failed</h4>
                <p>Consider:</p>
                <ul>
                    ${rec.suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            `;
            grid.appendChild(item);
        });
    }
}

function displayCheckResult(elementId, isPassed) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = isPassed ? 
            '<i class="fas fa-check"></i> Passed' : 
            '<i class="fas fa-times"></i> Failed';
        element.style.color = isPassed ? 'green' : 'red';
    }
}

function calculateResults() {
    const soilParams = getSoilParameters();
    const pileParams = getPileParameters();
    const loadingParams = getLoadingParameters();
    
    const results = performCalculations(soilParams, pileParams, loadingParams);
    displayResults(results);
}

function toggleHeadCondition(condition, event) {
    const buttons = event.target.parentElement.querySelectorAll('.toggle-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide images
    const fixedImg = document.getElementById('fixed-head-img');
    const freeImg = document.getElementById('free-head-img');

    if (condition === 'fixed') {
        fixedImg.style.display = 'block';
        freeImg.style.display = 'none';
    } else {
        fixedImg.style.display = 'none';
        freeImg.style.display = 'block';
    }
}
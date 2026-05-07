# Decision Matrix Pro: Undergraduate Programme Choice Simulator

## Project Overview
This project is an interactive decision-support application developed for the **STTHK2133 Modeling & Simulation** course (Assignment #1). It simulates the decision-making process of a pre-university student, Aiman, who must select an undergraduate programme in Malaysia.

The application leverages the **Discrete Choice Approach** and the **Multinomial Logit Model** to analyze selection behavior systematically and predict outcomes based on competing priorities.

## Problem Statement
Aiman faces a critical decision in selecting between six distinct academic paths. His choice is influenced by a combination of deterministic factors and inherent uncertainties regarding future prospects and personal preferences.

### Choice Set (Alternatives)
The model evaluates the following six mutually exclusive programmes:
* Pure Sciences
* Applied Sciences
* Engineering
* Accounting
* Management
* Arts

### Influencing Factors
Each alternative is rated (1-5) across six key dimensions:
1.  **Interest**: Personal affinity for the field.
2.  **Exam Results**: Match with entry requirements.
3.  **Future Career**: Job opportunities and salary potential.
4.  **Location**: Distance from home and city preference.
5.  **Fees**: Affordability and tuition costs.
6.  **Willingness to Explore**: Openness to new areas of study.

## Technical Implementation
### Mathematical Model
The simulator uses a **Multinomial Logit (MNL) Model**. The probability ($P_i$) of choosing programme $i$ is calculated using the Softmax function.

### Key Features
* **Interactive Control Panel**: Real-time adjustment of factor weights and programme ratings via sliders.
* **Dynamic Visualizations**: 
    * **Bar Charts**: Compare Conversion Probabilities and Raw Utility Scores.
    * **Radar Chart**: Multidimensional comparison of the top 3 alternatives.
    * **Heatmap Matrix**: Visual correlation of factor contributions.

## Model Assumptions
1.  **Rationality**: The decision-maker aims to maximize perceived utility.
2.  **Mutually Exclusive Options**: The choice set is finite, exhaustive, and mutually exclusive.
3.  **Independence of Irrelevant Alternatives (IIA)**: The relative probability between two options is unaffected by others.

## Files
* `A1.html`: The User Interface (UI) structure and styling.
* `Assignment1.js`: The core calculation engine and Chart.js integration.

## Academic Context
* **Course**: STTHK2133 Modeling & Simulation
* **Assignment**: Individual Assignment #1 (A252)
* **Instructor**: Dr. Shakiroh Binti Khamis
---
*Developed as part of the STTHK2133 academic curriculum.*
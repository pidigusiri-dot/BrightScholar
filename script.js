console.log("SmartScholar JavaScript is running");


/* =========================================
   FIND SCHOLARSHIPS - BACKEND API
   ========================================= */

const scholarshipForm =
    document.getElementById("scholarshipForm");


scholarshipForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        console.log(
            "Find Scholarships button clicked"
        );


        /* =========================================
           GET STUDENT INFORMATION
           ========================================= */

        const name =
            document.getElementById("name")
            .value
            .trim();


        const course =
            document.getElementById("course")
            .value;


        const cgpa =
            Number(
                document.getElementById("cgpa")
                .value
            );


        const income =
            Number(
                document.getElementById("income")
                .value
            );


        const state =
            document.getElementById("state")
            .value;


        const category =
            document.getElementById("category")
            .value;


        const gender =
            document.getElementById("gender")
            .value;


        const area =
            document.getElementById("area")
            .value
            .trim();


        /* =========================================
           BASIC VALIDATION
           ========================================= */

        if (
            !name ||
            !course ||
            isNaN(cgpa) ||
            isNaN(income) ||
            !state ||
            !category ||
            !gender ||
            !area
        ) {

            alert(
                "Please fill in all the fields."
            );

            return;
        }


        if (cgpa < 0 || cgpa > 10) {

            alert(
                "CGPA must be between 0 and 10."
            );

            return;
        }


        if (income < 0) {

            alert(
                "Family income cannot be negative."
            );

            return;
        }


        /* =========================================
           SEND DATA TO DJANGO BACKEND
           ========================================= */

        try {

            console.log(
                "Sending student data to backend..."
            );


            const response =
                await fetch(
                    "http://127.0.0.1:8000/api/check-eligibility/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            category: category,

                            family_income: income,

                            state: state,

                            course: course,

                            cgpa: cgpa,

                            gender: gender,

                            area_of_study: area

                        })
                    }
                );


            /* =========================================
               CHECK BACKEND RESPONSE
               ========================================= */

            if (!response.ok) {

                throw new Error(
                    `Backend returned status ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Backend response:",
                data
            );


            /* =========================================
               DISPLAY RESULTS
               ========================================= */

            displayResults(
                data.scholarships,
                name
            );

        }


        catch (error) {

            console.error(
                "Backend connection error:",
                error
            );


            alert(
                "Unable to connect to the SmartScholar backend. Please make sure the Django server is running."
            );

        }

    }
);


/* =========================================
   DISPLAY RESULTS
   ========================================= */

function displayResults(
    eligibleScholarships,
    studentName
) {

    const resultsContainer =
        document.getElementById(
            "scholarshipResults"
        );


    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


    resultsContainer.innerHTML = "";


    /* =========================================
       NO SCHOLARSHIPS FOUND
       ========================================= */

    if (
        !eligibleScholarships ||
        eligibleScholarships.length === 0
    ) {

        resultMessage.textContent =
            `Sorry ${studentName}, no matching scholarships were found based on the details provided.`;


        resultsContainer.innerHTML = `

            <div class="empty-results">

                <div class="empty-icon">
                    😔
                </div>

                <h3>
                    No Matching Scholarships Found
                </h3>

                <p>
                    Try checking your details or
                    explore official scholarship portals
                    for more opportunities.
                </p>

                <br>

                <a
                    href="https://scholarships.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="apply-button"
                >
                    Visit National Scholarship Portal
                </a>

            </div>

        `;

    }


    /* =========================================
       SCHOLARSHIPS FOUND
       ========================================= */

    else {

        resultMessage.textContent =
            `${eligibleScholarships.length} scholarship(s) may match your profile, ${studentName}.`;


        eligibleScholarships.forEach(
            function (scholarship) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "scholarship-card";


                /* =========================================
                   APPLICATION LINK
                   ========================================= */

                const applicationLink =
                    scholarship.application_url
                    ? scholarship.application_url
                    : "https://scholarships.gov.in/";


                /* =========================================
                   SCHOLARSHIP CARD
                   ========================================= */

                card.innerHTML = `

                    <div class="scholarship-top">

                        <h3>
                            ${scholarship.name}
                        </h3>

                    </div>


                    <div class="scholarship-info">


                        <div class="info-row">

                            <span>
                                Provider
                            </span>

                            <span>
                                ${
                                    scholarship.provider
                                    || "Not specified"
                                }
                            </span>

                        </div>


                        <div class="info-row">

                            <span>
                                Minimum CGPA
                            </span>

                            <span>
                                ${
                                    scholarship.minimum_cgpa
                                    || "No minimum"
                                }
                            </span>

                        </div>


                        <div class="info-row">

                            <span>
                                Maximum Family Income
                            </span>

                            <span>

                                ${
                                    scholarship.income_limit
                                    ? "₹" +
                                      Number(
                                          scholarship.income_limit
                                      ).toLocaleString(
                                          "en-IN"
                                      )
                                    : "No limit"
                                }

                            </span>

                        </div>


                        <div class="info-row">

                            <span>
                                Deadline
                            </span>

                            <span>
                                ${
                                    scholarship.deadline
                                    || "Not specified"
                                }
                            </span>

                        </div>


                    </div>


                    <div class="scholarship-description">

                        <p>
                            ${
                                scholarship.description
                                || "No description available."
                            }
                        </p>

                    </div>


                    <a
                        href="${applicationLink}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="apply-button"
                    >
                        Apply on Official Website →
                    </a>

                `;


                resultsContainer.appendChild(
                    card
                );

            }
        );

    }


    /* =========================================
       SCROLL TO RESULTS
       ========================================= */

    const resultsSection =
        document.getElementById(
            "results"
        );


    if (resultsSection) {

        resultsSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   AI ASSISTANT - FRONTEND DEMO
   ========================================= */

const chatForm =
    document.getElementById("chatForm");


const chatInput =
    document.getElementById("chatInput");


const chatMessages =
    document.getElementById("chatMessages");


if (chatForm) {

    chatForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const question =
                chatInput.value.trim();


            if (!question) {

                return;

            }


            /* =========================================
               SHOW USER MESSAGE
               ========================================= */

            addChatMessage(
                question,
                "user"
            );


            chatInput.value = "";


            /* =========================================
               TEMPORARY AI RESPONSE
               ========================================= */

            setTimeout(
                function () {

                    const answer =
                        getDemoAIResponse(
                            question
                        );


                    addChatMessage(
                        answer,
                        "ai"
                    );

                },
                500
            );

        }
    );

}


/* =========================================
   ADD CHAT MESSAGE
   ========================================= */

function addChatMessage(
    message,
    sender
) {

    const messageDiv =
        document.createElement(
            "div"
        );


    messageDiv.className =
        `message ${sender}-message`;


    if (sender === "ai") {

        messageDiv.innerHTML = `

            <div class="message-avatar">
                🤖
            </div>

            <div class="message-content">
                ${message}
            </div>

        `;

    }


    else {

        messageDiv.innerHTML = `

            <div class="message-content">
                ${message}
            </div>

        `;

    }


    chatMessages.appendChild(
        messageDiv
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =========================================
   TEMPORARY AI RESPONSES
   ========================================= */

function getDemoAIResponse(
    question
) {

    const text =
        question.toLowerCase();


    /* =========================================
       DOCUMENT QUESTION
       ========================================= */

    if (
        text.includes("document") ||
        text.includes("documents")
    ) {

        return `

            Common scholarship documents include
            academic marksheets, income certificate,
            category certificate, bank details and
            identity proof.

            The exact documents depend on the
            scholarship.

        `;

    }


    /* =========================================
       CGPA / ELIGIBILITY QUESTION
       ========================================= */

    if (
        text.includes("cgpa") ||
        text.includes("eligibility")
    ) {

        return `

            Scholarship eligibility can depend on
            CGPA, family income, category, state,
            course and other requirements.

            Please check the specific scholarship
            requirements before applying.

        `;

    }


    /* =========================================
       APPLICATION QUESTION
       ========================================= */

    if (
        text.includes("apply") ||
        text.includes("application")
    ) {

        return `

            To apply, open the official application
            link provided on the scholarship card and
            follow the instructions on the official
            scholarship portal.

        `;

    }


    /* =========================================
       INCOME QUESTION
       ========================================= */

    if (
        text.includes("income")
    ) {

        return `

            Family income limits vary between
            scholarships.

            SmartScholar uses the income limit
            specified for each scholarship while
            checking eligibility.

        `;

    }


    /* =========================================
       DEFAULT RESPONSE
       ========================================= */

    return `

        I can help with questions about scholarship
        eligibility, documents, income limits, CGPA,
        application process and official scholarship
        portals.

        <br><br>

        In the next stage, we will connect this
        assistant to a real AI service.

    `;

}


/* =========================================
   FINAL MESSAGE
   ========================================= */

console.log(
    "SmartScholar is ready!"
);
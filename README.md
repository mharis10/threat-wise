# Phishing Defender

Phishing Defender is a cutting-edge web platform designed to empower businesses to safeguard their employees against the increasing threat of phishing emails. By offering a comprehensive suite of training modules, customizable test email campaigns, and detailed analytics, Phishing Defender aims to enhance the cybersecurity posture of companies across the globe. Integrated with OpenAI, the platform delivers insightful analytics, aids in crafting effective email templates, and provides instant assistance to user queries, making cybersecurity education both effective and accessible.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MySQL](https://www.mysql.com/) (Database Server)

## Configuration

- Rename the env.example file (present in the backend folder) to .env file and configure everything according to your setup.

## Getting Started

### Installation:

To get started with the project:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/phishing-defender.git
   ```

2. Setup MySQL:

- Ensure MySQL server is running on your machine.
- Create a new connection to MySQL.
- Copy the connection string and place it in the .env file.
- All the collections will be automatically created once the backend service is run.

3. Navigate to the project backend:

   ```bash
   cd phishing-defender/backend
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Run the backend:

   ```bash
   npm start
   ```

6. Navigate to the project frontend:

   ```bash
   cd phishing-defender/frontend
   ```

7. Install dependencies:

   ```bash
   npm install
   ```

8. Run the frontend:

   ```bash
   npm start
   ```

9. Access the Application:

- The app should be accessible on http://localhost:3001.

## Key Features

- **Employee Training Modules:** Tailored lessons and quizzes to educate employees on recognizing phishing attempts.
- **Customizable Test Emails:** Generate and dispatch simulated phishing emails to assess and improve the phishing detection skills of employees.
- **Template Creation:** Companies can design their own phishing simulation emails, enhancing the realism and relevance of training exercises.
- **Comprehensive Analytics:** Access in-depth statistics for the company, specific departments, or individual employees, showcasing areas of strength and opportunities for improvement.
- **OpenAI Integration:** Leverage advanced AI to gain insights from analytics, assist in creating effective email templates, and answer user queries, all within the platform.

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js
- **Database:** MySQL

## Contributing

I'm always open to collaboration and learning from others! If you have ideas for projects, exercises, or improvements, please feel free to contribute. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository.

2. Create your feature branch::

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. Commit your changes:

   ```bash
   git commit -am 'Add some YourFeatureName.'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/YourFeatureName
   ```

5. Open a pull request.

## Connect With Me

I am eager to connect with fellow developers and learners. If you're interested in discussing ideas, sharing feedback, or simply connecting, don't hesitate to reach out.

---

Embark on your cybersecurity journey with Phishing Defender and make your digital environment safer for everyone. Happy coding!

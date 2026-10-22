# বাজার দর (BazarDor)

**A web application for exploring daily essential commodity prices in Bangladesh.**

## Project Overview and Short Description

বাজার দর (BazarDor) is a responsive web application that helps users explore the prices of essential commodities across different categories. Users can view current prices, compare price changes, sort products by price, and access detailed product information, including market-wise price ranges.

The application provides user authentication and profile management, allowing users to register, sign in, and update their profile information.

## Technologies Used

- **Next.js** — React framework and App Router for application routing and page rendering.
- **React** — Component-based user interface development.
- **JavaScript** — Application logic and interactive functionality.
- **Tailwind CSS** — Responsive styling and layout.
- **DaisyUI** — Prebuilt UI components and styling utilities.
- **Better Auth** — Email/password authentication and Google and GitHub social login.
- **MongoDB** — Database for authentication and user-related data.
- **React Hot Toast** — Notifications for authentication, validation, and other user actions.
- **External REST API** — Retrieval of product, category, and pricing information.

## Key Features

### 1. Daily Commodity Price Dashboard
Displays essential products with their names, units, current prices, and percentage changes. Price changes are indicated using visual badges to make increases and decreases easy to identify.

### 2. Price Trends and Product Categories
Highlights products with rising and falling prices. Users can browse products by category and sort them by default order, ascending price, or descending price.

### 3. Product Details and Market-Wise Prices
Provides individual product detail pages with current and previous prices, minimum and maximum price ranges, average prices, and available market-wise pricing information.

### 4. User Authentication and Social Login
Supports account registration and sign-in using email and password, as well as Google and GitHub authentication. Protected product details require users to sign in.

### 5. User Profile Management
Allows authenticated users to view their profile and update their name through a dedicated form.

### 6. Responsive User Interface
Designed for mobile phones, tablets, and desktop screens, with responsive navigation, product grids, and page layouts.

### 7. Loading States and Error Handling
Uses skeleton loading interfaces, toast notifications, and friendly error pages to improve usability during loading, authentication, and invalid-route scenarios.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

You will also need a MongoDB database and the credentials for any social login providers you want to enable.

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd bazar-dor
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and configure the required environment variables:

   ```env
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your_generated_secret
   MONGODB_URI=your_mongodb_connection_string

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

   Replace the placeholder values with your own credentials. Configure the Google and GitHub credentials if you intend to use those providers. Never commit `.env.local` or expose your secrets in the repository.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Source

Product and category information is retrieved from the BazarDor REST API provided for this project:

`https://openapi.programming-hero.com/api/bazardor`

The availability and accuracy of displayed prices depend on the API data.

## Deployment

The application can be deployed to Vercel or another compatible hosting platform.

Before deployment, configure the required environment variables in the hosting platform, update the Better Auth base URL, and configure the Google and GitHub OAuth callback URLs for the production domain.

## Project Status

BazarDor is developed as a responsive web application for browsing essential commodity prices, comparing price changes, and managing user accounts.

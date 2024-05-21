# Group Management Application

## Overview

A web application to manage "Group" entities using. Each Group holds shipments based on specific criteria and properties, including criteria for shipment assignment, alert rules, and priority.

## Features

1. **table of Groups**:
    - Display a table of Groups with draggable rows to reorder by priority.
    
2. **Create New Group**:
    - Form to create a new Group with fields: Name, Description, Criteria, Alert Rules .
      - Alert Rules are Toggles for enabling/disabling temperature and shipment status alerts and temperature min/max  
      - Criteria are multiple origin and destination countries
      
    - New Groups are added with the lowest priority and validated for required fields.

3. **View Group Details**:
    - Detailed view of a Group showing all properties and enabled alert rules.

## Installation and Setup

### Prerequisites

- Node.js
- pnpm
- Bun

### Setup
1. clone the repo
  ```sh
    git clone https://github.com/tshuva/shipments-manager.git
    cd shipments-manager
  ```
### backend 
1. Install Bun: [Bun's website](https://bun.sh).
2. Set up the backend and run :
    ```sh
    cd server
    bun install
    bun run dev
    ```

#### Frontend 

1. Install  & pnpm
```sh
  npm install -g pnpm
  ```

2. Install dependencies and run:
    ```sh
    cd client
    pnpm install
    pnpm run dev
    ```

4. The app will be available at `http://localhost:5173`.

## API Endpoints

- **GET /groups**: Retrieve all Groups.
- **POST /groups**: Create a new Group.
- **PUT /groups/:id**: Update a Group.
- **DELETE /groups/:id**: Delete a Group.


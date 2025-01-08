# Website Peminjaman ITS TV

## **Data Models**
```bash
enum Role {
	'USER',
	'ADMIN'
}

type User = {
	username: string;
	password: string;
	role: Role;
}

type Items = {
    pic: string;
	name: string;
	amount: string;
	condition: string;
	created_at: Date;
}

type BorrowItems = {
	item_name: string;
	amount: string;
	borrow_date: Date;
	return_date: Date;
	borrower_name: string;
	officer_name: string;
}

type Operators = {
    image: string;
    name: string;
    age: string;
    NoTelp: string;
    Email: string;
}
```

## Technologies Used

- **Frontend**: HTML, CSS, TypeScript, Vue.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Version Control**: Git, GitHub

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/FikriAuliaa/Web_Teknisi_ITSTV.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Web_Teknisi_ITSTV
    ```

### BackEnd

3. Navigate to the BackEnd directory:
    ```bash
    cd server
    ```
4. Install dependencies:
    ```bash
    npm install
    ```
5. Set up the database and configure environment variables.
    ```bash
    MONGODB_URI=mongodb+srv://[username]:[pw]@[cluster-name]/[db-name]?retryWrites=true&w=majority&appName=[]
    JWT_SECRET=(....)
    PORT=5000
    ```
6. Start the development server:
    ```bash
    npm run start:dev
    ```
    
### FrontEnd

3. Navigate to the FrontEnd directory:
    ```bash
    cd client
    ```
4. Install dependencies:
    ```bash
    npm install
    ```
5. Start the development server:
    ```bash
    npm run dev 
    ```

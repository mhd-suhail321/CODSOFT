import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder

# This gets the directory where model.py is located
base_path = os.path.dirname(__file__)
file_path = os.path.join(base_path, 'data', 'Titanic-Dataset.csv')

def clean_data(df):
    # 1. Drop columns that won't help the model
    df = df.drop(['PassengerId', 'Name', 'Ticket', 'Cabin'], axis=1)

    # 2. Fill missing values
    df['Age'] = df['Age'].fillna(df['Age'].median())
    df['Embarked'] = df['Embarked'].fillna(df['Embarked'].mode()[0])
    df['Fare'] = df['Fare'].fillna(df['Fare'].median())

    # 3. Convert Categorical data to Numbers
    # Sex: female -> 0, male -> 1
    # Embarked: C -> 0, Q -> 1, S -> 2
    le = LabelEncoder()
    df['Sex'] = le.fit_transform(df['Sex'])
    df['Embarked'] = le.fit_transform(df['Embarked'])

    return df

# --- Implementation ---
df = pd.read_csv(file_path) # Use the path from our previous step
df_clean = clean_data(df)

print("--- Cleaned Data Preview ---")
print(df_clean.head())
print("\nMissing values remaining:", df_clean.isnull().sum().sum())
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Define Features (X) and Target (y)
X = df_clean.drop('Survived', axis=1)
y = df_clean['Survived']

# 2. Split the data (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Initialize and Train the Model
model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
model.fit(X_train, y_train)

# 4. Evaluate the Model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"--- Model Results ---")
print(f"Accuracy: {accuracy * 100:.2f}%")
print("\nDetailed Report:")
print(classification_report(y_test, y_pred))
import joblib

# Save the model to a file
joblib.dump(model, 'titanic_model.pkl')
print("\nModel saved as 'titanic_model.pkl'!")
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# 1. Load Data (Assumes advertising.csv is in the data folder)
# Columns: TV, Radio, Newspaper, Sales
try:
    df = pd.read_csv('TASK_04_Sales_Prediction/data/advertising.csv')
except:
    # Creating a dummy path for now if file is missing
    print("Please ensure advertising.csv is in the /data folder!")
    exit()

# 2. Features and Target
X = df[['TV', 'Radio', 'Newspaper']]
y = df['Sales']

# 3. Split and Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)

# 4. Evaluate
score = r2_score(y_test, model.predict(X_test))
print(f"✅ Model Accuracy (R2 Score): {score:.4f}")

# 5. Save
joblib.dump(model, 'sales_model.pkl')
print("🚀 sales_model.pkl generated!")
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import SMOTE

print("📂 Loading Data...")
df = pd.read_csv('TASK_05_Creditcardfraud_Prediction/data/creditcard.csv')

# Use only the features we are mapping in the UI to make it super sensitive
# We use V14, V10, and Amount as our 'High Impact' features
features = ['V14', 'V10', 'Amount']
X = df[features]
y = df['Class']

print("⚖️ Balancing with SMOTE...")
X_res, y_res = SMOTE().fit_resample(X, y)

print("🧠 Training Logistic Regression...")
X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2)

# Logistic Regression is more 'linear', so small input changes = big output changes
model = LogisticRegression()
model.fit(X_train, y_train)

print("💾 Saving Model...")
joblib.dump(model, 'fraud_model.pkl')
print("✅ New Sensitive Model Ready!")
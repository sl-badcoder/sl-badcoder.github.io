import streamlit as st
import requests
import datetime
import matplotlib.pyplot as plt
from bs4 import BeautifulSoup
import json

def get_github_contributions(username):
    url = f"https://github.com/users/{username}/contributions"
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    data = {}
    for rect in soup.find_all("rect", {"data-date": True, "data-count": True}):
        date = rect["data-date"]
        count = int(rect["data-count"])
        data[date] = count
    return data

def get_leetcode_submissions(username):
    url = "https://leetcode.com/graphql"
    headers = {
        "Content-Type": "application/json",
        "Referer": f"https://leetcode.com/{username}/"
    }
    query = {
        "operationName": "userProblemsSolved",
        "variables": {"username": username},
        "query": """
        query userProblemsSolved($username: String!) {
          matchedUser(username: $username) {
            userCalendar {
              submissionCalendar
            }
          }
        }
        """
    }
    res = requests.post(url, json=query, headers=headers)
    try:
        raw_calendar = res.json()['data']['matchedUser']['userCalendar']['submissionCalendar']
        calendar = json.loads(raw_calendar)
        daily = {}
        for timestamp, count in calendar.items():
            date = datetime.datetime.utcfromtimestamp(int(timestamp)).strftime('%Y-%m-%d')
            daily[date] = count
        return daily
    except:
        return {}

def combine_data(gh_data, lc_data):
    start_date = (datetime.date.today() - datetime.timedelta(days=365))
    dates = [start_date + datetime.timedelta(days=i) for i in range(366)]
    combined = []
    for d in dates:
        date_str = d.strftime("%Y-%m-%d")
        total = gh_data.get(date_str, 0) + lc_data.get(date_str, 0)
        combined.append(total)
    max_val = max(combined) if combined else 1
    normalized = [v / max_val for v in combined]
    return dates, normalized

def plot_activities(user_data):
    plt.figure(figsize=(12, 5))
    for username, (dates, values) in user_data.items():
        plt.plot(dates, values, label=username)
    plt.title("Normalized GitHub + LeetCode Activity (Past Year)")
    plt.xlabel("Date")
    plt.ylabel("Normalized Activity")
    plt.legend()
    plt.tight_layout()
    st.pyplot(plt)

# --- Streamlit App ---
st.title("📈 GitHub + LeetCode Activity Tracker")

col1, col2 = st.columns(2)
with col1:
    github1 = st.text_input("GitHub Username - User 1", value="octocat")
    leetcode1 = st.text_input("LeetCode Username - User 1", value="leetcode")

with col2:
    github2 = st.text_input("GitHub Username - User 2", value="torvalds")
    leetcode2 = st.text_input("LeetCode Username - User 2", value="example_user")

if st.button("Compare Activity"):
    user_data = {}
    with st.spinner("Fetching data for User 1..."):
        gh1 = get_github_contributions(github1)
        lc1 = get_leetcode_submissions(leetcode1)
        dates1, norm1 = combine_data(gh1, lc1)
        user_data[f"{github1} + {leetcode1}"] = (dates1, norm1)

    with st.spinner("Fetching data for User 2..."):
        gh2 = get_github_contributions(github2)
        lc2 = get_leetcode_submissions(leetcode2)
        dates2, norm2 = combine_data(gh2, lc2)
        user_data[f"{github2} + {leetcode2}"] = (dates2, norm2)

    st.success("Data loaded successfully!")
    plot_activities(user_data)


import streamlit as st
import requests
import datetime
import matplotlib.pyplot as plt
from bs4 import BeautifulSoup
import json

# --- GitHub Contributions ---
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

# --- LeetCode Submissions ---
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

# --- Combine & Normalize ---
def combine_data(gh_data, lc_data):
    start_date = datetime.date.today() - datetime.timedelta(days=365)
    dates = [start_date + datetime.timedelta(days=i) for i in range(366)]

    combined = []
    cumulative = 0
    cumulative_series = []

    for d in dates:
        date_str = d.strftime("%Y-%m-%d")
        total = gh_data.get(date_str, 0) + lc_data.get(date_str, 0)
        cumulative += total
        cumulative_series.append(cumulative)

    max_val = cumulative_series[-1] if cumulative_series else 1
    normalized = [v / max_val for v in cumulative_series]
    return dates, normalized

# --- Plot ---
def plot_activity(dates, values, label):
    plt.figure(figsize=(12, 5))
    plt.plot(dates, values, label=label)
    plt.title("Normalized GitHub + LeetCode Activity (Past Year)")
    plt.xlabel("Date")
    plt.ylabel("Normalized Activity")
    plt.legend()
    plt.tight_layout()
    st.pyplot(plt)

# --- Streamlit UI ---
st.title("📊 Your Yearly Coding Activity")
github = st.text_input("GitHub Username", value="octocat")
leetcode = st.text_input("LeetCode Username", value="leetcode")

if st.button("Show Activity"):
    with st.spinner("Fetching GitHub data..."):
        gh = get_github_contributions(github)

    with st.spinner("Fetching LeetCode data..."):
        lc = get_leetcode_submissions(leetcode)

    if not gh and not lc:
        st.error("No data found. Please check the usernames.")
    else:
        st.success("Data loaded!")
        dates, values = combine_data(gh, lc)
        plot_activity(dates, values, f"{github} + {leetcode}")


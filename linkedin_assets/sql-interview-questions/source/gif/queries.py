# Reflowed queries for the GIF (max ~42 chars per line). Shared by the test and the page builder.
Q = {
1: """SELECT dept_id, name, salary
FROM (
  SELECT e.*,
    DENSE_RANK() OVER (
      PARTITION BY dept_id
      ORDER BY salary DESC) AS rnk
  FROM employees e
) t
WHERE rnk = 2;  -- N = 2""",
2: """SELECT month, revenue,
  ROUND(100.0 * (revenue - prev)
        / NULLIF(prev, 0), 1) AS mom_pct
FROM (
  SELECT month, revenue,
    LAG(revenue) OVER (ORDER BY month)
      AS prev
  FROM monthly_sales
) t;""",
3: """SELECT product,
  SUM(CASE WHEN quarter = 'Q1'
           THEN sales END) AS q1,
  SUM(CASE WHEN quarter = 'Q2'
           THEN sales END) AS q2
  -- Q3 and Q4 the same way
FROM sales
GROUP BY product;""",
4: """SELECT email, COUNT(*) AS copies
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;""",
5: """SELECT product, sale_date, amount,
  SUM(amount) OVER (
    PARTITION BY product
    ORDER BY sale_date
    ROWS UNBOUNDED PRECEDING
  ) AS running_total,
  AVG(amount) OVER (
    PARTITION BY product
    ORDER BY sale_date
    ROWS 6 PRECEDING
  ) AS avg_7
FROM sales;""",
6: """SELECT name, salary,
  CASE
    WHEN salary IS NULL   THEN 'unknown'
    WHEN salary < 100000 THEN 'L1'
    WHEN salary < 140000 THEN 'L2'
    ELSE 'L3'
  END AS level
FROM employees;""",
8: """SELECT m.name,
  COUNT(e.emp_id) AS direct_reports
FROM employees m
LEFT JOIN employees e
  ON e.manager_id = m.emp_id
GROUP BY m.emp_id, m.name;""",
}

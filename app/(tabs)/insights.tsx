import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { styled } from "nativewind";
import { useMemo } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const chartConfig = {
  backgroundGradientFrom: "#fff9e3",
  backgroundGradientTo: "#fff9e3",
  color: (opacity = 1) => `rgba(8, 17, 38, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForLabels: {
    fontSize: 10,
    fontWeight: "600",
    fill: "#081126",
  },
  propsForDots: {
    r: "4.5",
    strokeWidth: "2",
    stroke: "#fff9e3",
  },
};

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth - 40;
const pieChartWidth = Math.min(screenWidth - 80, 300); // Smaller, responsive pie chart

const ChartCard = styled(View);
const ChartTitle = styled(Text);

const Insights = () => {
  const { subscriptions } = useSubscriptionStore();

  const totalMonthlySpending = useMemo(() => {
    return subscriptions
      .filter((sub) => sub.status === "active")
      .reduce((sum, sub) => {
        // Normalize price to monthly equivalent
        const monthlyPrice =
          sub.billing === "Yearly" ? sub.price / 12 : sub.price;
        return sum + monthlyPrice;
      }, 0);
  }, [subscriptions]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {};
    subscriptions.forEach((sub) => {
      if (sub.category) {
        // Normalize price to monthly equivalent
        const monthlyPrice =
          sub.billing === "Yearly" ? sub.price / 12 : sub.price;
        breakdown[sub.category] = (breakdown[sub.category] || 0) + monthlyPrice;
      }
    });
    return breakdown;
  }, [subscriptions]);

  // Derive chart data from subscriptions
  const monthlySpendingData = useMemo(() => {
    // Generate last 12 months of data
    const now = new Date();
    const months = [];
    const data = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleString("default", { month: "short" });
      months.push(i % 2 === 0 ? monthLabel : ""); // Show every 2nd month
      data.push(totalMonthlySpending); // Use consistent spending for demo
    }

    return {
      labels: months,
      datasets: [
        {
          data,
          strokeWidth: 2,
          color: () => "#ea7a53",
        },
      ],
    };
  }, [totalMonthlySpending]);

  // Category data for pie chart
  const categoryChartData = useMemo(() => {
    const categoryColors: { [key: string]: string } = {
      Design: "#ea7a53",
      "Developer Tools": "#8fd1bd",
      "AI Tools": "#f5c542",
      Other: "#b8d4e3",
      Entertainment: "#ea7a53",
      Productivity: "#8fd1bd",
      Health: "#f5c542",
    };

    return Object.entries(categoryBreakdown).map((entry, idx) => {
      const total = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);
      const percentage = Math.round((entry[1] / total) * 100);
      return {
        name: entry[0],
        population: percentage,
        color: categoryColors[entry[0]] || "#b8d4e3",
        legendFontColor: "#081126",
      };
    });
  }, [categoryBreakdown]);

  // Last 6 months data
  const last6MonthsData = useMemo(() => {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [
            totalMonthlySpending,
            totalMonthlySpending,
            totalMonthlySpending,
            totalMonthlySpending,
            totalMonthlySpending,
            totalMonthlySpending,
          ],
          color: () => "#8fd1bd",
          strokeWidth: 2,
        },
      ],
    };
  }, [totalMonthlySpending]);

  // Budget vs actual
  const budgetVsActual = useMemo(() => {
    const budgetLimit = 400; // $400 monthly budget
    return {
      labels: ["Budget", "Actual"],
      datasets: [
        {
          data: [budgetLimit, totalMonthlySpending],
          color: () => "#081126",
        },
      ],
    };
  }, [totalMonthlySpending]);

  // Subscription-wise spending
  const subscriptionWiseData = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active",
    );
    const colors: { [key: string]: string } = {
      Netflix: "#ea7a53",
      Spotify: "#1DB954",
      "Adobe Creative Cloud": "#FF0000",
      "GitHub Pro": "#1f6feb",
      "Claude Pro": "#b8d4e3",
      Figma: "#a259ff",
      Notion: "#00d4ff",
    };

    return {
      labels: activeSubscriptions.map((sub) => sub.name),
      data: activeSubscriptions.map((sub) =>
        sub.billing === "Yearly" ? sub.price / 12 : sub.price,
      ),
      colors: activeSubscriptions.map((sub) => colors[sub.name] || "#c0c0c0"),
    };
  }, [subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-5 pt-5 pb-4">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Insights
          </Text>
          <Text className="text-base font-semibold text-foreground opacity-70">
            Total Monthly Spending: ${totalMonthlySpending.toFixed(2)}
          </Text>
        </View>

        {/* Monthly Spending Trend - Line Chart */}
        <ChartCard className="mx-5 mb-5 bg-card rounded-2xl p-4 shadow-sm">
          <ChartTitle className="text-lg font-bold text-foreground mb-3">
            📈 Monthly Spending Trend
          </ChartTitle>
          <LineChart
            data={monthlySpendingData}
            width={chartWidth}
            height={240}
            chartConfig={chartConfig}
            bezier
            style={{ marginLeft: -20, marginRight: -10 }}
            verticalLabelRotation={0}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withInnerLines={true}
            withOuterLines={true}
            segments={4}
            onDataPointClick={({ index, value }) => {
              console.log(`Month ${index}: $${value}`);
            }}
          />
          <Text className="text-xs text-foreground opacity-60 mt-3 text-center">
            Last 12 months spending trend (showing every 2nd month)
          </Text>
        </ChartCard>

        {/* Category Breakdown - Pie Chart */}
        <ChartCard className="mx-5 mb-5 bg-card rounded-2xl p-4 shadow-sm overflow-hidden">
          <ChartTitle className="text-lg font-bold text-foreground mb-4">
            🥧 Spending by Category
          </ChartTitle>
          <View className="items-center mb-4">
            <PieChart
              data={categoryChartData}
              width={pieChartWidth}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={{ marginVertical: 0, marginHorizontal: "auto" }}
            />
          </View>
          <View className="flex-row flex-wrap justify-center gap-3">
            {categoryChartData.map((item, idx) => (
              <View key={item.name} className="flex-row items-center gap-2">
                <View
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
                <Text className="text-xs text-foreground">
                  {item.name} ({item.population}%)
                </Text>
              </View>
            ))}
          </View>
        </ChartCard>

        {/* Last 6 Months Comparison - Bar Chart */}
        <ChartCard className="mx-5 mb-5 bg-card rounded-2xl p-4 shadow-sm">
          <ChartTitle className="text-lg font-bold text-foreground mb-3">
            📊 Last 6 Months Comparison
          </ChartTitle>
          <BarChart
            data={last6MonthsData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel="$"
            yAxisSuffix=""
            style={{ marginLeft: -15 }}
          />
          <Text className="text-xs text-foreground opacity-60 mt-2 text-center">
            Monthly spending comparison
          </Text>
        </ChartCard>

        {/* Budget vs Actual - Bar Chart */}
        <ChartCard className="mx-5 mb-5 bg-card rounded-2xl p-4 shadow-sm">
          <ChartTitle className="text-lg font-bold text-foreground mb-3">
            💰 Budget vs Actual Spending
          </ChartTitle>
          <BarChart
            data={budgetVsActual}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel="$"
            yAxisSuffix=""
            style={{ marginLeft: -15 }}
            showValuesOnTopOfBars
            fromZero
          />
          <View className="flex-row justify-center gap-4 mt-4">
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-accent" />
              <Text className="text-sm font-semibold text-foreground">
                Budget: $400
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-subscription" />
              <Text className="text-sm font-semibold text-foreground">
                Actual: ${totalMonthlySpending.toFixed(2)}
              </Text>
            </View>
          </View>
        </ChartCard>

        {/* Subscription-wise Distribution - Horizontal Bar Chart */}
        <ChartCard className="mx-5 mb-5 bg-card rounded-2xl p-4 shadow-sm">
          <ChartTitle className="text-lg font-bold text-foreground mb-4">
            🎯 Subscription-wise Cost Distribution
          </ChartTitle>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {subscriptionWiseData.labels.map((label, idx) => {
                const maxValue = Math.max(...subscriptionWiseData.data);
                const percentage =
                  (subscriptionWiseData.data[idx] / maxValue) * 100;
                return (
                  <View key={label} className="mb-4 mr-2">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-xs font-semibold text-foreground w-20">
                        {label}
                      </Text>
                      <Text className="text-xs text-foreground opacity-60">
                        ${subscriptionWiseData.data[idx].toFixed(2)}
                      </Text>
                    </View>
                    <View className="h-6 bg-muted rounded-lg overflow-hidden">
                      <View
                        className="h-full rounded-lg"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: subscriptionWiseData.colors[idx],
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </ChartCard>

        {/* Summary Stats */}
        <View className="mx-5 mb-5 bg-card rounded-2xl p-4 shadow-sm">
          <ChartTitle className="text-lg font-bold text-foreground mb-4">
            📋 Summary Statistics
          </ChartTitle>
          <View className="flex-row flex-wrap gap-3">
            <StatBox
              label="Active Subscriptions"
              value={subscriptions
                .filter((s) => s.status === "active")
                .length.toString()}
              color="#8fd1bd"
            />
            <StatBox
              label="Avg Monthly Spend"
              value={`$${totalMonthlySpending.toFixed(2)}`}
              color="#ea7a53"
            />
            <StatBox
              label="Annual Cost"
              value={`$${(totalMonthlySpending * 12).toFixed(2)}`}
              color="#f5c542"
            />
            <StatBox
              label="Categories"
              value={Object.keys(categoryBreakdown).length.toString()}
              color="#b8d4e3"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface StatBoxProps {
  label: string;
  value: string;
  color: string;
}

const StatBox = ({ label, value, color }: StatBoxProps) => (
  <View className="flex-1 min-w-[45%] bg-background rounded-xl p-3 border border-border">
    <Text className="text-xs font-semibold text-foreground opacity-70 mb-1">
      {label}
    </Text>
    <Text className="text-lg font-bold" style={{ color }}>
      {value}
    </Text>
  </View>
);

export default Insights;

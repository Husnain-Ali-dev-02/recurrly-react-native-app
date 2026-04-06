import {
    BUDGET_VS_ACTUAL,
    CATEGORY_SPENDING_DATA,
    LAST_6_MONTHS_DATA,
    MONTHLY_SPENDING_DATA,
    SUBSCRIPTION_WISE_SPENDING,
} from "@/constants/data";
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
      .reduce((sum, sub) => sum + sub.price, 0);
  }, [subscriptions]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {};
    subscriptions.forEach((sub) => {
      if (sub.category) {
        breakdown[sub.category] = (breakdown[sub.category] || 0) + sub.price;
      }
    });
    return breakdown;
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
            data={MONTHLY_SPENDING_DATA}
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
              data={CATEGORY_SPENDING_DATA.data}
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
            {CATEGORY_SPENDING_DATA.data.map((item, idx) => (
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
            data={LAST_6_MONTHS_DATA}
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
            data={BUDGET_VS_ACTUAL}
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
                Actual: $372.1
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
              {SUBSCRIPTION_WISE_SPENDING.labels.map((label, idx) => {
                const maxValue = Math.max(...SUBSCRIPTION_WISE_SPENDING.data);
                const percentage =
                  (SUBSCRIPTION_WISE_SPENDING.data[idx] / maxValue) * 100;
                return (
                  <View key={label} className="mb-4 mr-2">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-xs font-semibold text-foreground w-20">
                        {label}
                      </Text>
                      <Text className="text-xs text-foreground opacity-60">
                        ${SUBSCRIPTION_WISE_SPENDING.data[idx].toFixed(2)}
                      </Text>
                    </View>
                    <View className="h-6 bg-muted rounded-lg overflow-hidden">
                      <View
                        className="h-full rounded-lg"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            SUBSCRIPTION_WISE_SPENDING.colors[idx],
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
              value={`$${(totalMonthlySpending / 12).toFixed(2)}`}
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

import moment from "moment";

const CustomChartTooltip = ({ payload, tabKey }: { payload: any; tabKey: string }) => {
  if (!payload || payload.length === 0) return null;

  const data = payload[0]?.payload; // Get the hovered data point
  if (!data) return null;

  // Extract the first two meaningful fields dynamically
  const keys = Object.keys(data);
  const labelKey = keys[0]; // The date field (e.g., "2025-03-21")
  const valueKey = keys[1]; // The numeric value field (e.g., "orders")

  const dateValue = moment(data[labelKey]); // Convert the date string to Moment.js object
  let formattedLabel: string | null = "N/A";

  // Determine the correct display format based on tabKey
  if (dateValue.isValid()) {
    switch (tabKey) {
      case "today":
      case "yesterday":
        formattedLabel = null; // Example: "10:30 AM"
        break;
      case "thisWeek":
        formattedLabel = dateValue.format("dddd"); // Example: "Monday"
        break;
      case "thisMonth":
        formattedLabel = `Week ${dateValue.week() - moment().startOf("month").week() + 1}`; // Example: "Week 2"
        break;
      case "thisYear":
        formattedLabel = dateValue.format("MMMM"); // Example: "March"
        break;
      default:
        formattedLabel = dateValue.format("LL"); // Default formatted date
    }
  }

  return (
    <div className="bg-white p-2 shadow-md rounded-md text-black">
      <p className="text-sm text-gray-500">
        <span className="font-bold capitalize">{formattedLabel}:</span>{" "}
        {data[valueKey]?.toLocaleString()}
      </p>
    </div>
  );
};

export default CustomChartTooltip;

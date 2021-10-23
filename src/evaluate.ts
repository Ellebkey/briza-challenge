export type Value = string | number

export const ComparisonOperator = '==' as const
export type ComparisonOperator = typeof ComparisonOperator

export type Context = Record<string, Value>
export type Variable = string // starts with $

export type ComparisonExpression = [
  ComparisonOperator,
  Variable | Value,
  Variable | Value
]

export const LogicalOperators = ['AND', 'OR'] as const
export type LogicalOperator = typeof LogicalOperators[number]
export type LogicalExpression = [LogicalOperator, ...ComparisonExpression[]]

function getCtxData(value: Value, ctx: Context): Value {
  return typeof value === 'string' && value.length > 1 && value[0] === '$'
    ? ctx[value.substring(1, value.length)]
    : value;
}

export function evaluateComparison(
  condition: ComparisonExpression,
  context: Context = {}
): boolean {
  const value1 = getCtxData(condition[1], context);
  const value2 = getCtxData(condition[2], context);

  return value1 === value2;
}

export function evaluateLogical(
  condition: LogicalExpression,
  context: Context
): boolean {
  let expressions: boolean[] = [];
  const operator = condition.shift();

  condition.forEach(comparisonExp => {
    const valueComparation = comparisonExp;
    if(typeof valueComparation !== 'string') {
      const comparation = evaluateComparison(valueComparation, context);
      expressions.push(comparation);
    }
  });

  let result = true;
  if(operator === 'AND') {
    result = expressions.every(el => el);
  } else if (operator === 'OR') {
    result = expressions.some(el => el);
  }

  return result
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidSpacecrafts, isApiError } from '@src/utils/valid';
import { getDisplayValue } from '@src/utils/valid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.selectedItems || !Array.isArray(body.selectedItems)) {
      return NextResponse.json(
        {
          error:
            'Invalid request format: expected { selectedItems: Spacecraft[] }',
        },
        { status: 400 }
      );
    }

    const validatedItems = isValidSpacecrafts(body.selectedItems);

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { error: 'No valid spacecraft items found in selectedItems' },
        { status: 400 }
      );
    }

    const headers = [
      'UID',
      'Name',
      'Class',
      'Status',
      'Registry',
      'Species',
      'Owner',
      'Operator',
      'Affiliation',
    ];
    const csvRows = validatedItems.map(item => [
      `"${item.uid}"`,
      `"${item.name}"`,
      `"${getDisplayValue(item.spacecraftClass?.name)}"`,
      `"${getDisplayValue(item.status)}"`,
      `"${getDisplayValue(item.registry)}"`,
      `"${getDisplayValue(item.species)}"`,
      `"${getDisplayValue(item.owner?.name)}"`,
      `"${getDisplayValue(item.operator?.name)}"`,
      `"${getDisplayValue(item.affiliation?.name)}"`,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${validatedItems.length}_items.csv`,
      },
    });
  } catch (error) {
    console.error('CSV generation error:', error);

    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

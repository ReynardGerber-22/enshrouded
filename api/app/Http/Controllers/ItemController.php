<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Http\Resources\ItemResource;

class ItemController extends Controller
{
    //public function index(): JsonResponse
    public function index(Request $request)
    {
        $filters = $request->validate([
            'slot' => ['sometimes', 'string', 'in:weapon,helmet,chest,legs,arms,boots,ring,shield'],
            'level' => ['sometimes', 'integer', 'between:1,50'],
            'item_level' => ['sometimes', 'integer', 'between:1,50'],
            'search' => ['sometimes', 'string', 'max:100'],
        ]);
        $query = Item::query()
            ->with('perks')
            ->whereNotNull('equip_slot');

        if (isset($filters['slot'])) {
            $query->where('equip_slot', $filters['slot']);
        }

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['level'])) {
            $query->where('min_level', '<=', $filters['level']);
        }

        return ItemResource::collection($query->paginate(20));
    }
}
